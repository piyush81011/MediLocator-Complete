import { ProductRequest } from "../models/productRequest.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProductRequest = asyncHandler(async (req, res) => {
  const { productName, brand, category, dosageForm, packSize, genericName, manufacturer, description, requiresPrescription, reason } = req.body;

  if (!productName || !brand || !category || !reason) {
    throw new ApiError(400, "Product name, brand, category, and reason are required");
  }

  const request = await ProductRequest.create({
    store: req.store._id,
    productName,
    brand,
    category,
    dosageForm,
    packSize,
    genericName,
    manufacturer,
    description,
    requiresPrescription: requiresPrescription || false,
    reason
  });

  return res
    .status(201)
    .json(new ApiResponse(201, request, "Product request submitted successfully. Admin will review it soon."));
});

const getStoreProductRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = { store: req.store._id };
  if (status) {
    filter.status = status;
  }

  const requests = await ProductRequest.find(filter)
    .populate("approvedProduct")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await ProductRequest.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        requests,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      "Product requests fetched successfully"
    )
  );
});

const getProductRequestById = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await ProductRequest.findOne({
    _id: requestId,
    store: req.store._id
  }).populate("approvedProduct");

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request fetched successfully"));
});

const deleteProductRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await ProductRequest.findOneAndDelete({
    _id: requestId,
    store: req.store._id,
    status: "pending"
  });

  if (!request) {
    throw new ApiError(404, "Request not found or cannot be deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Request deleted successfully"));
});

export {
  createProductRequest,
  getStoreProductRequests,
  getProductRequestById,
  deleteProductRequest
};