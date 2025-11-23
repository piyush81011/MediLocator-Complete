// bill.model.js
import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    default: "Walk-in Customer"
  },
  customerPhone: String,
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "other"],
    default: "cash"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "refunded"],
    default: "completed"
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCatalog",
      required: true
    },
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreInventory"
    },
    name: String, // Store product name for records
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    soldPrice: {
      type: Number,
      required: true
    },
    price: Number, // Alias for frontend compatibility
    batchNumber: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true 
});

export const Bill = mongoose.model("Bill", billSchema);