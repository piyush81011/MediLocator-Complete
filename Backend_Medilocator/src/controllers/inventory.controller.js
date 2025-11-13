import { StoreInventory } from "../models/inventory.models.js";
import { ProductCatalog } from "../models/productCatalog.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addProductToInventory = asyncHandler(async (req, res) => {
  const { productId, price, stockQuantity, expiryDate, batchNumber, minStockAlert } = req.body;

  // 1. UPDATE VALIDATION (Batch number is now required)
  if (!productId || !price || !stockQuantity || !expiryDate || !batchNumber) {
    throw new ApiError(400, "Product ID, price, stock quantity, expiry date, and batch number are required");
  }

  // Check if product exists in catalog (no change)
  const product = await ProductCatalog.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found in catalog");
  }

  // 2. UPDATE DUPLICATE CHECK (Now checks for the batch)
  const existingInventory = await StoreInventory.findOne({
    store: req.store._id,
    product: productId,
    batchNumber: batchNumber // Check for a matching batch number
  });

  if (existingInventory) {
    throw new ApiError(409, "This exact batch (Product + Batch Number) already exists. Use the update endpoint to modify.");
  }

  // Create inventory item (this code now works for batches)
  const inventory = await StoreInventory.create({
    store: req.store._id,
    product: productId,
    price,
    stockQuantity,
    expiryDate,
    batchNumber: batchNumber,
    minStockAlert: minStockAlert || 10
  });

  const populatedInventory = await StoreInventory.findById(inventory._id).populate("product");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedInventory, "Product batch added to inventory successfully"));
});

const getStoreInventory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search, sortBy = "createdAt", order = "desc" } = req.query;

  const matchStage = { store: req.store._id };

  // Build aggregation pipeline
  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "productcatalogs",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" }
  ];

  // Add category filter
  if (category) {
    pipeline.push({
      $match: { "product.category": category }
    });
  }

  // Add search filter
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "product.name": { $regex: search, $options: "i" } },
          { "product.brand": { $regex: search, $options: "i" } },
          { "product.genericName": { $regex: search, $options: "i" } }
        ]
      }
    });
  }

  // Add sorting
  const sortOrder = order === "desc" ? -1 : 1;
  // Sort by product name first, then by the requested field (e.g., expiryDate)
  pipeline.push({ $sort: { "product.name": 1, [sortBy]: sortOrder } });


  // Count total documents
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await StoreInventory.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add pagination
  pipeline.push(
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) }
  );

  const inventory = await StoreInventory.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        inventory,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      "Inventory fetched successfully"
    )
  );
});

const updateInventoryItem = asyncHandler(async (req, res) => {
  const { inventoryId } = req.params;
  // Batch number CANNOT be updated, so it's not included here
  const { price, stockQuantity, expiryDate, minStockAlert, isAvailable } = req.body;

  const updateData = { price, stockQuantity, expiryDate, minStockAlert, isAvailable };

  // Remove undefined fields so you can update just one thing (e.g., only price)
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  if (Object.keys(updateData).length === 0) {
     throw new ApiError(400, "At least one field (price, stock, etc.) is required to update");
  }

  const inventory = await StoreInventory.findOneAndUpdate(
    {
      _id: inventoryId,
      store: req.store._id // Ensure store can only update their own items
    },
    {
      $set: updateData
    },
    { new: true } // Return the updated document
  );

  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }
  
  // Re-populate the product details to send back
  const updatedInventory = await StoreInventory.findById(inventoryId).populate("product");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInventory, "Inventory updated successfully"));
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { inventoryId } = req.params;

  const inventory = await StoreInventory.findOneAndDelete({
    _id: inventoryId,
    store: req.store._id // Ensure store can only delete their own items
  });

  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed from inventory successfully"));
});

const getInventoryStats = asyncHandler(async (req, res) => {
  const storeId = req.store._id;

  const stats = await StoreInventory.aggregate([
    { $match: { store: storeId } },
    {
      $facet: {
        // We now count UNIQUE products, not total batches
        totalProducts: [
          { $group: { _id: "$product" } },
          { $count: "count" }
        ],
        outOfStock: [
          { $match: { stockQuantity: 0 } },
          { $count: "count" }
        ],
        lowStock: [
          {
            $match: {
              $expr: { $lte: ["$stockQuantity", "$minStockAlert"] },
              stockQuantity: { $gt: 0 }
            }
          },
          { $count: "count" }
        ],
        expired: [
          { $match: { expiryDate: { $lt: new Date() } } },
          { $count: "count" }
        ],
        expiringSoon: [
          {
            $match: {
              expiryDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
              }
            }
          },
          { $count: "count" }
        ]
      }
    }
  ]);

  const result = {
    totalProducts: stats[0].totalProducts[0]?.count || 0,
    outOfStock: stats[0].outOfStock[0]?.count || 0,
    lowStock: stats[0].lowStock[0]?.count || 0,
    expired: stats[0].expired[0]?.count || 0,
    expiringSoon: stats[0].expiringSoon[0]?.count || 0
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Inventory stats fetched successfully"));
});

// --- THIS IS THE NEW FUNCTION FOR YOUR BILLING/POS PAGE ---
const searchStoreInventory = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const storeId = req.store._id;

  if (!search) {
    return res.status(200).json(new ApiResponse(200, [], "Empty search query"));
  }

  // We search for items in this store's inventory
  // that are in stock AND match the product name/brand
  const items = await StoreInventory.aggregate([
    {
      $match: {
        store: storeId,
        stockQuantity: { $gt: 0 }, // Only find items that are in stock
        isAvailable: true,
        expiryDate: { $gt: new Date() } // And not expired
      }
    },
    {
      $lookup: {
        from: "productcatalogs",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $match: {
        $or: [
          { "product.name": { $regex: search, $options: "i" } },
          { "product.brand": { $regex: search, $options: "i" } },
          { "product.genericName": { $regex: search, $options: "i" } }
        ]
      }
    },
    {
      $sort: { "product.name": 1, "expiryDate": 1 } // Sort by name, then by expiry (oldest first)
    }
  ]);

  return res.status(200).json(new ApiResponse(200, items, "Inventory search successful"));
});
// --- END OF NEW FUNCTION ---


const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await StoreInventory.find({
    store: req.store._id,
    $expr: { $lte: ["$stockQuantity", "$minStockAlert"] },
    stockQuantity: { $gt: 0 }
  })
    .populate("product")
    .sort({ stockQuantity: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Low stock products fetched successfully"));
});

const getExpiredProducts = asyncHandler(async (req, res) => {
  const products = await StoreInventory.find({
    store: req.store._id,
    expiryDate: { $lt: new Date() }
  })
    .populate("product")
    .sort({ expiryDate: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Expired products fetched successfully"));
});

const getExpiringSoonProducts = asyncHandler(async (req, res) => {
  const products = await StoreInventory.find({
    store: req.store._id,
    expiryDate: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })
    .populate("product")
    .sort({ expiryDate: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Expiring soon products fetched successfully"));
});



export {
  addProductToInventory,
  getStoreInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
  searchStoreInventory, // <-- ADD THE NEW EXPORT
  getLowStockProducts,
  getExpiredProducts,
  getExpiringSoonProducts
};