import { Bill } from "../models/bill.model.js";
import { StoreInventory } from "../models/inventory.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBill = asyncHandler(async (req, res) => {
  const { items, customerName, customerPhone, paymentMethod } = req.body;
  const storeId = req.store._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Bill must contain at least one item");
  }

  let totalAmount = 0;
  const updates = [];
  const billItems = [];

  // 1. First, check stock for ALL items before doing anything
  for (const item of items) {
    const inventoryBatch = await StoreInventory.findById(item.inventoryId);

    if (!inventoryBatch || inventoryBatch.store.toString() !== storeId.toString()) {
      throw new ApiError(404, `Item ${item.name} with batch ${item.batchNumber} not found.`);
    }

    if (inventoryBatch.stockQuantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name} (Batch: ${item.batchNumber}). Available: ${inventoryBatch.stockQuantity}, Requested: ${item.quantity}`);
    }

    totalAmount += inventoryBatch.price * item.quantity;
    billItems.push({
      product: inventoryBatch.product,
      inventory: inventoryBatch._id,
      quantity: item.quantity,
      soldPrice: inventoryBatch.price,
      name: item.name,
      batchNumber: inventoryBatch.batchNumber,
    });
    updates.push({
      id: inventoryBatch._id,
      quantity: item.quantity
    });
  }
  
  // 2. All checks passed. Now create the bill.
  const bill = await Bill.create({
    store: storeId,
    customerName: customerName || "Walk-in",
    customerPhone: customerPhone || "",
    paymentMethod: paymentMethod || "cash",
    paymentStatus: "completed",
    items: billItems,
    totalAmount: totalAmount
  });

  if (!bill) {
    throw new ApiError(500, "Failed to create the bill");
  }

  // 3. After the bill is successfully created, update the inventory
  await Promise.all(
    updates.map(upd => 
      StoreInventory.findByIdAndUpdate(upd.id, {
        $inc: { stockQuantity: -upd.quantity }
      })
    )
  );

  return res
    .status(201)
    .json(new ApiResponse(201, bill, "Bill created successfully"));
});

const getStoreBills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const storeId = req.store._id;

  const bills = await Bill.find({ store: storeId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
    
  const total = await Bill.countDocuments({ store: storeId });

  return res.status(200).json(
    new ApiResponse(200, {
      bills,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }, "Bills fetched successfully")
  );
});

export { createBill, getStoreBills };