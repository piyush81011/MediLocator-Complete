import mongoose, { Schema } from "mongoose";

// This schema defines a single item *within* the bill
const billItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductCatalog",
    required: true
  },
  inventory: {
    type: Schema.Types.ObjectId,
    ref: "StoreInventory", // The specific batch this item came from
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // We store these fields directly on the bill for historical accuracy
  soldPrice: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  }
});

const billSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },
    // Optional: Link to a registered customer
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // For walk-in customers
    customerName: {
      type: String,
      trim: true,
      default: "Walk-in"
    },
    customerPhone: {
      type: String,
      trim: true
    },
    items: [billItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card", "online"],
      default: "cash"
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["completed", "pending", "failed"],
      default: "completed"
    }
  },
  { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);