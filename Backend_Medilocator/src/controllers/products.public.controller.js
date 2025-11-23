// src/controllers/products.public.controller.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StoreInventory } from "../models/inventory.models.js";
import mongoose from "mongoose";

// escape regex helper
const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * GET /api/v1/products/search?q=paracetamol&page=1&limit=20&category=medicine&sort=price&order=asc
 *
 * Returns: paginated list of products matched + for each product:
 *  - product details
 *  - stores: [{ storeId, name, contact, price, stockQuantity, isAvailable }]
 *  - priceStats: { minPrice, maxPrice, avgPrice }
 */
const searchProductsPublic = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  const category = req.query.category;
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
  const sortBy = req.query.sortBy || "minPrice"; // minPrice | maxPrice | avgPrice | name
  const order = req.query.order === "asc" ? 1 : -1;
  const includeOutOfStock = req.query.includeOutOfStock === "true"; // default false

  // Build match stage for search
  const matchStages = [];

  if (q) {
    const escaped = escapeRegex(q);
    matchStages.push({
      $or: [
        { "product.name": { $regex: escaped, $options: "i" } },
        { "product.brand": { $regex: escaped, $options: "i" } },
        { "product.genericName": { $regex: escaped, $options: "i" } }
      ]
    });
  }

  if (category) {
    matchStages.push({ "product.category": category });
  }

  if (!includeOutOfStock) {
    matchStages.push({ stockQuantity: { $gt: 0 } });
  }

  // Aggregation pipeline that groups by product and collects store-level info + price stats
  const pipeline = [
    // join product catalog
    {
      $lookup: {
        from: "productcatalogs",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    // join store info
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store"
      }
    },
    { $unwind: "$store" },

    // optionally search / category / stock
    ...(matchStages.length ? [{ $match: { $and: matchStages } }] : []),

    // project only required fields to reduce size
    {
      $project: {
        product: {
          _id: "$product._id",
          name: "$product.name",
          brand: "$product.brand",
          genericName: "$product.genericName",
          category: "$product.category",
          requiresPrescription: "$product.requiresPrescription"
        },
        price: 1,
        stockQuantity: 1,
        isAvailable: 1,
        batchNumber: 1,
        expiryDate: 1,
        store: {
          _id: "$store._id",
          name: "$store.name",
          phone: "$store.phone",
          email: "$store.email",
          address: "$store.address"
        }
      }
    },

    // group by product to aggregate all stores
    {
      $group: {
        _id: "$product._id",
        product: { $first: "$product" },
        stores: {
          $push: {
            storeId: "$store._id",
            name: "$store.name",
            phone: "$store.phone",
            email: "$store.email",
            address: "$store.address",
            price: "$price",
            stockQuantity: "$stockQuantity",
            isAvailable: "$isAvailable",
            expiryDate: "$expiryDate",
            batchNumber: "$batchNumber"
          }
        },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        avgPrice: { $avg: "$price" },
        totalStores: { $sum: 1 }
      }
    },

    // optional sort by product name ascending by default
    {
      $addFields: {
        avgPrice: { $round: ["$avgPrice", 2] }
      }
    }
  ];

  // build facet for pagination and total count
  const sortStage =
    sortBy === "name"
      ? { "product.name": order }
      : sortBy === "maxPrice"
      ? { maxPrice: order }
      : sortBy === "avgPrice"
      ? { avgPrice: order }
      : { minPrice: order };

  const facet = {
    $facet: {
      paginatedResults: [{ $sort: sortStage }, { $skip: (page - 1) * limit }, { $limit: limit }],
      totalCount: [{ $count: "count" }]
    }
  };

  const finalPipeline = [...pipeline, facet];

  const agg = await StoreInventory.aggregate(finalPipeline);

  const results = agg[0]?.paginatedResults || [];
  const total = agg[0]?.totalCount[0]?.count || 0;
  const pages = Math.ceil(total / limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { products: results, total, page, pages, limit }, "Search results"));
});

export { searchProductsPublic };
