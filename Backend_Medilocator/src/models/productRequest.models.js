import mongoose, { Schema } from "mongoose";

const productRequestSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["medicine", "equipment", "supplement", "other"]
    },
    dosageForm: {
      type: String,
      trim: true
    },
    packSize: {
      type: String,
      trim: true
    },
    genericName: {
      type: String,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    requiresPrescription: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String,
      trim: true,
      required: [true, "Reason for request is required"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    adminNotes: {
      type: String,
      trim: true
    },
    approvedProduct: {
      type: Schema.Types.ObjectId,
      ref: "ProductCatalog"
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
productRequestSchema.index({ store: 1, status: 1 });
productRequestSchema.index({ createdAt: -1 });

export const ProductRequest = mongoose.model("ProductRequest", productRequestSchema);
