import { StoreInventory } from "../models/inventory.models.js";
import { ProductCatalog } from "../models/productCatalog.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper function to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const addProductToInventory = asyncHandler(async (req, res) => {
  const { productId, price, stockQuantity, expiryDate, batchNumber, minStockAlert } = req.body;

  if (!productId || !price || !stockQuantity || !expiryDate || !batchNumber) {
    throw new ApiError(400, "Product ID, price, stock quantity, expiry date, and batch number are required");
  }

  const product = await ProductCatalog.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found in catalog");
  }

  const existingInventory = await StoreInventory.findOne({
    store: req.store._id,
    product: productId,
    batchNumber: batchNumber
  });

  if (existingInventory) {
    throw new ApiError(409, "This exact batch (Product + Batch Number) already exists. Use the update endpoint to modify.");
  }

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

  if (category) {
    pipeline.push({
      $match: { "product.category": category }
    });
  }

  // FIX: Escape special regex characters
  if (search) {
    const escapedSearch = escapeRegex(search);
    pipeline.push({
      $match: {
        $or: [
          { "product.name": { $regex: escapedSearch, $options: "i" } },
          { "product.brand": { $regex: escapedSearch, $options: "i" } },
          { "product.genericName": { $regex: escapedSearch, $options: "i" } }
        ]
      }
    });
  }

  const sortOrder = order === "desc" ? -1 : 1;
  pipeline.push({ $sort: { "product.name": 1, [sortBy]: sortOrder } });

  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await StoreInventory.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

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
  const { price, stockQuantity, expiryDate, minStockAlert, isAvailable } = req.body;

  const updateData = { price, stockQuantity, expiryDate, minStockAlert, isAvailable };

  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  if (Object.keys(updateData).length === 0) {
     throw new ApiError(400, "At least one field (price, stock, etc.) is required to update");
  }

  const inventory = await StoreInventory.findOneAndUpdate(
    {
      _id: inventoryId,
      store: req.store._id
    },
    {
      $set: updateData
    },
    { new: true }
  );

  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }
  
  const updatedInventory = await StoreInventory.findById(inventoryId).populate("product");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInventory, "Inventory updated successfully"));
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { inventoryId } = req.params;

  const inventory = await StoreInventory.findOneAndDelete({
    _id: inventoryId,
    store: req.store._id
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
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            }
          },
          { $count: "count" }
        ]
      }
    }
  ]);

  const total = stats[0].totalProducts[0]?.count || 0;
  const lowStock = stats[0].lowStock[0]?.count || 0;
  const outOfStock = stats[0].outOfStock[0]?.count || 0;
  const expired = stats[0].expired[0]?.count || 0;
  const expiringSoon = stats[0].expiringSoon[0]?.count || 0;

  // Calculate percentages (protect divide-by-zero)
  const lowStockPercent = total ? Math.round((lowStock / total) * 100) : 0;
  const outOfStockPercent = total ? Math.round((outOfStock / total) * 100) : 0;
  const expiredPercent = total ? Math.round((expired / total) * 100) : 0;
  const expiringSoonPercent = total ? Math.round((expiringSoon / total) * 100) : 0;
  const healthyStockPercent = total
    ? Math.round(((total - lowStock - outOfStock - expired) / total) * 100)
    : 0;

  return res.status(200).json(
    new ApiResponse(200,
      {
        totalProducts: total,
        lowStock,
        outOfStock,
        expired,
        expiringSoon,

        // NEW → Needed for dashboard
        lowStockPercent,
        outOfStockPercent,
        expiredPercent,
        expiringSoonPercent,
        healthyStockPercent
      },
      "Inventory stats fetched successfully"
    )
  );
});


// FIX: Escape regex in search function
const searchStoreInventory = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const storeId = req.store._id;

  if (!search) {
    return res.status(200).json(new ApiResponse(200, [], "Empty search query"));
  }

  // FIX: Escape special regex characters
  const escapedSearch = escapeRegex(search);

  const items = await StoreInventory.aggregate([
    {
      $match: {
        store: storeId,
        stockQuantity: { $gt: 0 },
        isAvailable: true,
        expiryDate: { $gt: new Date() }
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
          { "product.name": { $regex: escapedSearch, $options: "i" } },
          { "product.brand": { $regex: escapedSearch, $options: "i" } },
          { "product.genericName": { $regex: escapedSearch, $options: "i" } }
        ]
      }
    },
    {
      $sort: { "product.name": 1, "expiryDate": 1 }
    }
  ]);

  return res.status(200).json(new ApiResponse(200, items, "Inventory search successful"));
});

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
  searchStoreInventory,
  getLowStockProducts,
  getExpiredProducts,
  getExpiringSoonProducts
};