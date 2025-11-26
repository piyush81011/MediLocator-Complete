import mongoose, { Schema } from "mongoose";

const productCatalogSchema = new Schema(
  {
    //agr koi field jada lge to km kr dena 
    name: { type: String, required: true, trim: true, index: true },
    brand: { type: String, required: true, trim: true },
    //category ko dropdown me rkhna bhai
    category: {             
      type: String,
      required: true,
      enum: ["medicine", "equipment", "supplement", "other"],
      index: true,
    },
    dosageForm: { type: String, trim: true },
    packSize: { type: String, trim: true },
    description: { type: String, trim: true },
    genericName: { type: String, trim: true, index: true },
    manufacturer: { type: String, trim: true },
    requiresPrescription: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productCatalogSchema.index({ name: "text", genericName: "text", brand: "text" });



export const ProductCatalog = mongoose.model("ProductCatalog", productCatalogSchema);