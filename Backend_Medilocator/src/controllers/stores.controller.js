import { Store } from "../models/store.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (storeId) => {
  try {
    const store = await Store.findById(storeId);
    const accessToken = store.generateAccessToken();
    const refreshToken = store.generateRefreshToken();

    store.refreshToken = refreshToken;
    await store.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerStore = asyncHandler(async (req, res) => {
  const { storeName, address, email, contactNo, licenseNumber, password } = req.body;

  // Validation
  if ([storeName, address, email, contactNo, licenseNumber, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if store already exists
  const existedStore = await Store.findOne({
    $or: [{ email }, { licenseNumber }]
  });

  if (existedStore) {
    throw new ApiError(409, "Store with email or license number already exists");
  }

  // Create store
  const store = await Store.create({
    storeName,
    address,
    email,
    contactNo,
    licenseNumber,
    password
  });

  const createdStore = await Store.findById(store._id).select("-password -refreshToken");

  if (!createdStore) {
    throw new ApiError(500, "Something went wrong while registering store");
  }

  return res.status(201).json(
    new ApiResponse(201, createdStore, "Store registered successfully")
  );
});

const loginStore = asyncHandler(async (req, res) => {
  const { email, licenseNumber, password } = req.body;

  if (!email && !licenseNumber) {
    throw new ApiError(400, "Email or license number is required");
  }

  const store = await Store.findOne({
    $or: [{ email }, { licenseNumber }]
  });

  if (!store) {
    throw new ApiError(404, "Store does not exist");
  }

  const isPasswordValid = await store.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(store._id);

  const loggedInStore = await Store.findById(store._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          store: loggedInStore,
          accessToken,
          refreshToken
        },
        "Store logged in successfully"
      )
    );
});

const logoutStore = asyncHandler(async (req, res) => {
  await Store.findByIdAndUpdate(
    req.store._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Store logged out successfully"));
});

const getCurrentStore = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.store, "Current store fetched successfully"));
});

const updateStoreDetails = asyncHandler(async (req, res) => {
  const { storeName, address, contactNo } = req.body;

  if (!storeName && !address && !contactNo) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updateFields = {};
  if (storeName) updateFields.storeName = storeName;
  if (address) updateFields.address = address;
  if (contactNo) updateFields.contactNo = contactNo;

  const store = await Store.findByIdAndUpdate(
    req.store._id,
    { $set: updateFields },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store details updated successfully"));
});

const changeStorePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const store = await Store.findById(req.store._id);
  const isPasswordCorrect = await store.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  store.password = newPassword;
  await store.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  registerStore,
  loginStore,
  logoutStore,
  getCurrentStore,
  updateStoreDetails,
  changeStorePassword
};