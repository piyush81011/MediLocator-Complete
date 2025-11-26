import { ProductCatalog } from "../models/productCatalog.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add a new product to catalog

const addMedicine = asyncHandler(async (req, res) => {
  const { name, brand, category, dosageForm, packSize, description, genericName, manufacturer, requiresPrescription } = req.body;
  const existedMedcine = await ProductCatalog.findOne({name, brand, genericName});

  //check if medicine is already added
  if (existedMedcine) {
    throw new ApiError(409, "The medicine is already added")
  }

  //add medicine if noot exists
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
  return res.status(200).json(
    new ApiResponse(200, newMedicine, "Medicine added successfully")
  )
})


// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;

  const query = {};
  
  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { genericName: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await ProductCatalog.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await ProductCatalog.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, "Products retrieved successfully")
  );
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await ProductCatalog.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product retrieved successfully")
  );
});



export { addMedicine,getAllProducts }