import { ProductCatalog } from "../models/productCatalog.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addMedicine = asyncHandler(async (req, res) => {
  const { name, brand, category, dosageForm, packSize, description, genericName, manufacturer, requiresPrescription } = req.body;
  const existedMedcine = await ProductCatalog.findOne({name, brand, genericName});

  //check if medicine is already added
  if (existedMedcine) {
    throw new ApiError(409, "The medicine is already added")
  }

  //add medicine if not exists
  const newMedicine = new ProductCatalog({
    name,
    brand,
    category,
    dosageForm,
    packSize,
    description,
    genericName,
    manufacturer,
    requiresPrescription
  })

  if (!newMedicine) {
    throw new ApiError(400, "Something went wrong while adding medicine")
  }

  await newMedicine.save();
  return res.status(201).json( // Changed to 201 Created
    new ApiResponse(201, newMedicine, "Medicine added successfully")
  )
})

const searchProducts = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;

  if (!search) {
    throw new ApiError(400, "Search query is required");
  }

  const filter = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { genericName: { $regex: search, $options: "i" } }
    ]
  };

  if (category) {
    filter.category = category;
  }

  const products = await ProductCatalog.find(filter)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ name: 1 });

  const total = await ProductCatalog.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      "Products fetched successfully"
    )
  );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (category) {
    filter.category = category;
  }

  const products = await ProductCatalog.find(filter)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ name: 1 });

  const total = await ProductCatalog.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      "Products fetched successfully"
    )
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await ProductCatalog.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export {
  searchProducts,
  getAllProducts,
  getProductById,
  addMedicine
};