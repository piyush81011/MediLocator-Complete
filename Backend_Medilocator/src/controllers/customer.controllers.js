const searchMedicinesAcrossStores = asyncHandler(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(200).json(new ApiResponse(200, [], "Empty search"));
  }

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Aggregate to find medicines across all stores
  const results = await StoreInventory.aggregate([
    {
      $match: {
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
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    {
      $match: {
        $or: [
          { "productInfo.name": { $regex: escapedSearch, $options: "i" } },
          { "productInfo.brand": { $regex: escapedSearch, $options: "i" } },
          { "productInfo.genericName": { $regex: escapedSearch, $options: "i" } }
        ]
      }
    },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    { $unwind: "$storeInfo" },
    {
      $group: {
        _id: "$product",
        productName: { $first: "$productInfo.name" },
        brand: { $first: "$productInfo.brand" },
        genericName: { $first: "$productInfo.genericName" },
        category: { $first: "$productInfo.category" },
        requiresPrescription: { $first: "$productInfo.requiresPrescription" },
        stores: {
          $push: {
            storeName: "$storeInfo.storeName",
            address: "$storeInfo.address",
            phone: "$storeInfo.phone",
            price: "$price",
            stock: "$stockQuantity",
            batchNumber: "$batchNumber",
            expiryDate: "$expiryDate"
          }
        }
      }
    },
    { $sort: { productName: 1 } }
  ]);

  return res.status(200).json(new ApiResponse(200, results, "Search successful"));
});
const getAllMedicinesAcrossStores = asyncHandler(async (req, res) => {
  const results = await StoreInventory.aggregate([
    {
      $match: {
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
        as: "productInfo"
      }
    },
    { $unwind: "$productInfo" },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "storeInfo"
      }
    },
    { $unwind: "$storeInfo" },
    {
      $group: {
        _id: "$product",
        productName: { $first: "$productInfo.name" },
        brand: { $first: "$productInfo.brand" },
        genericName: { $first: "$productInfo.genericName" },
        category: { $first: "$productInfo.category" },
        requiresPrescription: { $first: "$productInfo.requiresPrescription" },
        stores: {
          $push: {
            storeName: "$storeInfo.storeName",
            address: "$storeInfo.address",
            phone: "$storeInfo.phone",
            price: "$price",
            stock: "$stockQuantity",
            batchNumber: "$batchNumber",
            expiryDate: "$expiryDate"
          }
        }
      }
    },
    { $sort: { productName: 1 } }
  ]);

  return res.status(200).json(new ApiResponse(200, results, "Success"));
});

export { getAllMedicinesAcrossStores ,searchMedicinesAcrossStores};

