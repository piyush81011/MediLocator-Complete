// import { Bill } from "../models/bill.model.js";
// import { StoreInventory } from "../models/inventory.models.js";
// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const createBill = asyncHandler(async (req, res) => {
//   const { items, customerName, customerPhone, paymentMethod } = req.body;
//   const storeId = req.store._id;

//   if (!items || items.length === 0) {
//     throw new ApiError(400, "Bill must contain at least one item");
//   }

//   let totalAmount = 0;
//   const updates = [];
//   const billItems = [];

//   // 1️⃣ Validate inventory + Prepare billItems
//   for (const item of items) {
//     const inventoryBatch = await StoreInventory.findById(item.inventoryId).populate("product");

//     if (!inventoryBatch || inventoryBatch.store.toString() !== storeId.toString()) {
//       throw new ApiError(404, `Product batch not found.`);
//     }

//     if (inventoryBatch.stockQuantity < item.quantity) {
//       throw new ApiError(
//         400,
//         `Insufficient stock for ${inventoryBatch.product.name}.
//          Available: ${inventoryBatch.stockQuantity}, Requested: ${item.quantity}`
//       );
//     }

//     const amount = inventoryBatch.price * item.quantity;
//     totalAmount += amount;

//     billItems.push({
//       product: inventoryBatch.product._id,
//       inventory: inventoryBatch._id,
//       quantity: item.quantity,
//       soldPrice: inventoryBatch.price,
//       name: inventoryBatch.product.name,      // ✅ FIXED
//       batchNumber: inventoryBatch.batchNumber // OPTIONAL
//     });

//     updates.push({
//       id: inventoryBatch._id,
//       quantity: item.quantity
//     });
//   }

//   // 2️⃣ Create the Bill
//   const bill = await Bill.create({
//     store: storeId,
//     customerName: customerName || "Walk-in Customer",
//     customerPhone: customerPhone || "",
//     paymentMethod: paymentMethod || "cash",
//     paymentStatus: "completed",
//     items: billItems,
//     totalAmount
//   });

//   if (!bill) throw new ApiError(500, "Failed to generate bill");

//   // 3️⃣ Deduct stock
//   await Promise.all(
//     updates.map((u) =>
//       StoreInventory.findByIdAndUpdate(u.id, {
//         $inc: { stockQuantity: -u.quantity }
//       })
//     )
//   );

//   return res.status(201).json(
//     new ApiResponse(201, bill, "Bill created successfully")
//   );
// });


// // GET STORE BILLS
// const getStoreBills = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 20 } = req.query;
//   const storeId = req.store._id;

//   const bills = await Bill.find({ store: storeId })
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//   const total = await Bill.countDocuments({ store: storeId });

//   return res.status(200).json(
//     new ApiResponse(200, {
//       bills,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / Number(limit))
//       }
//     }, "Bills fetched successfully")
//   );
// });

// export { createBill, getStoreBills };


import { Bill } from "../models/bill.model.js";
import { StoreInventory } from "../models/inventory.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBill = asyncHandler(async (req, res) => {
  const { items, customerName, customerPhone, paymentMethod, subtotal, discount, tax, total } = req.body;
  const storeId = req.store._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Bill must contain at least one item");
  }

  let totalAmount = 0;
  const updates = [];
  const billItems = [];

  // Validate inventory + Prepare billItems
  for (const item of items) {
    const inventoryBatch = await StoreInventory.findById(item.inventoryId).populate("product");

    if (!inventoryBatch || inventoryBatch.store.toString() !== storeId.toString()) {
      throw new ApiError(404, `Product batch not found.`);
    }

    if (inventoryBatch.stockQuantity < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for ${inventoryBatch.product.name}.
         Available: ${inventoryBatch.stockQuantity}, Requested: ${item.quantity}`
      );
    }

    const amount = inventoryBatch.price * item.quantity;
    totalAmount += amount;

    billItems.push({
      product: inventoryBatch.product._id,
      inventory: inventoryBatch._id,
      quantity: item.quantity,
      soldPrice: inventoryBatch.price,
      price: inventoryBatch.price,
      name: inventoryBatch.product.name,
      batchNumber: inventoryBatch.batchNumber
    });

    updates.push({
      id: inventoryBatch._id,
      quantity: item.quantity
    });
  }

  // Generate bill number
  const billCount = await Bill.countDocuments({ store: storeId });
  const billNumber = `BILL-${storeId.toString().slice(-4)}-${String(billCount + 1).padStart(5, '0')}`;

  // Create the Bill
  const bill = await Bill.create({
    store: storeId,
    billNumber,
    customerName: customerName || "Walk-in Customer",
    customerPhone: customerPhone || "",
    paymentMethod: paymentMethod || "cash",
    paymentStatus: "completed",
    items: billItems,
    subtotal: subtotal || totalAmount,
    discount: discount || 0,
    tax: tax || 0,
    totalAmount: total || totalAmount
  });

  if (!bill) throw new ApiError(500, "Failed to generate bill");

  // Deduct stock
  await Promise.all(
    updates.map((u) =>
      StoreInventory.findByIdAndUpdate(u.id, {
        $inc: { stockQuantity: -u.quantity }
      })
    )
  );

  return res.status(201).json(
    new ApiResponse(201, bill, "Bill created successfully")
  );
});

// GET STORE BILLS (Paginated)
const getStoreBills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const storeId = req.store._id;

  const bills = await Bill.find({ store: storeId })
    .populate('items.product', 'name brand')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Bill.countDocuments({ store: storeId });

  return res.status(200).json(
    new ApiResponse(200, {
      bills,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }, "Bills fetched successfully")
  );
});

// GET BILLING HISTORY
const getBillingHistory = asyncHandler(async (req, res) => {
  const storeId = req.store._id;

  const bills = await Bill.find({ store: storeId })
    .populate('items.product', 'name brand genericName')
    .sort({ createdAt: -1 })
    .lean();

  const transformedBills = bills.map(bill => ({
    _id: bill._id,
    billNumber: bill.billNumber || `BILL-${bill._id.toString().slice(-8)}`,
    customerName: bill.customerName,
    customerPhone: bill.customerPhone,
    paymentMethod: bill.paymentMethod,
    paymentStatus: bill.paymentStatus,
    subtotal: bill.subtotal || bill.totalAmount,
    discount: bill.discount || 0,
    tax: bill.tax || 0,
    total: bill.totalAmount,
    items: bill.items.map(item => ({
      product: item.product || { name: item.name || 'Unknown Product' },
      quantity: item.quantity,
      price: item.soldPrice || item.price,
      batchNumber: item.batchNumber
    })),
    createdAt: bill.createdAt,
    updatedAt: bill.updatedAt
  }));

  return res.status(200).json(
    new ApiResponse(200, transformedBills, "Billing history fetched successfully")
  );
});

// GET DAILY SALES STATS
const getDailySalesStats = asyncHandler(async (req, res) => {
  const storeId = req.store._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await Bill.aggregate([
    {
      $match: {
        store: storeId,
        createdAt: { $gte: today }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        totalBills: { $sum: 1 },
        avgBillValue: { $avg: "$totalAmount" }
      }
    }
  ]);

  const result = stats[0] || {
    totalSales: 0,
    totalBills: 0,
    avgBillValue: 0
  };

  return res.status(200).json(
    new ApiResponse(200, result, "Daily sales stats fetched successfully")
  );
});

export { 
  createBill, 
  getStoreBills, 
  getBillingHistory,
  getDailySalesStats 
};