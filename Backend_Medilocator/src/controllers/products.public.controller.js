// src/controllers/products.public.controller.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StoreInventory } from "../models/inventory.models.js";

// escape regex
const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

const searchProductsPublic = asyncHandler(async (req, res) => {
  const q = (req.query.q || req.query.search || "").trim();
  const category = (req.query.category || "").trim();
  const brand = (req.query.brand || "").trim();
  const priceMin = parseFloat(req.query.priceMin) || 0;
  const priceMax = parseFloat(req.query.priceMax) || 9999999;

  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);

  const sortBy = req.query.sortBy || req.query.sort || "minPrice";
  const order = req.query.order === "asc" ? 1 : -1;

  const includeOutOfStock = req.query.includeOutOfStock === "true";

  // BUILD MATCH STAGES SAFELY
  const match = {};

  // search keywords
  if (q.length > 0) {
    const regex = new RegExp(escapeRegex(q), "i");
    match.$or = [
      { "product.name": regex },
      { "product.genericName": regex },
      { "product.brand": regex },
      { "product.description": regex }
    ];
  }

  // filters
  if (category) match["product.category"] = category;
  if (brand) match["product.brand"] = new RegExp(escapeRegex(brand), "i");

  // availability
  if (!includeOutOfStock) {
    match.isAvailable = true;
    match.stockQuantity = { $gt: 0 };
    match.expiryDate = { $gt: new Date() };
  }

  // price range
  match.price = { $gte: priceMin, $lte: priceMax };


  // AGGREGATION PIPELINE
  const pipeline = [
    // 1. Lookup Product Details
    {
      $lookup: {
        from: "productcatalogs",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    // 2. Apply Filters (Search, Category, Brand, Availability, Price)
    { $match: match },

    // 3. Lookup Store Details
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store"
      }
    },
    { $unwind: "$store" },

    // 4. Group by Product to aggregate store offerings
    {
      $group: {
        _id: "$product._id",
        product: { $first: "$product" },

        stores: {
          $push: {
            storeId: "$store._id",
            name: "$store.storeName", // Use storeName based on your store model
            address: "$store.address",
            contactNo: "$store.contactNo",
            price: "$price",
            stockQuantity: "$stockQuantity",
            isAvailable: "$isAvailable",
            batchNumber: "$batchNumber",
            expiryDate: "$expiryDate"
          }
        },

        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        avgPrice: { $avg: "$price" },
        totalStores: { $sum: 1 }
      }
    },

    { $addFields: { avgPrice: { $round: ["$avgPrice", 2] } } }
  ];

  // sorting
  const sortStage =
    sortBy === "name"
      ? { "product.name": order }
      : sortBy === "maxPrice"
      ? { maxPrice: order }
      : sortBy === "avgPrice"
      ? { avgPrice: order }
      : { minPrice: order }; // default sort by lowest price

  pipeline.push({
    $facet: {
      paginatedResults: [
        { $sort: sortStage },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ],
      totalCount: [{ $count: "count" }]
    }
  });

  const agg = await StoreInventory.aggregate(pipeline);

  const results = agg[0].paginatedResults;
  const totalDocs = agg[0].totalCount[0] ? agg[0].totalCount[0].count : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: results, // renamed to 'data' to match typical frontend expectation or keep as 'medicines'
        meta: {
          total: totalDocs,
          page,
          limit,
          pages: Math.ceil(totalDocs / limit)
        }
      },
      "Public product search successful"
    )
  );
});

export { searchProductsPublic };