// models/Product.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
   name: string;
   imagePublicId: string;
   tags: number[];
   category: number[];
   shippingFee: number;
   price: number;
   sold: number;
   inStock: boolean;
   brand: string;
   description: string;
   createdAt: Date;
   updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
   {
      name: { type: String, required: true },
      imagePublicId: { type: String, required: true },
      tags: { type: [Number], default: [] },
      category: { type: [Number], default: [] },
      shippingFee: { type: Number, required: true },
      price: { type: Number, required: true },
      sold: { type: Number, default: 0 },
      inStock: { type: Boolean, default: true },
      brand: { type: String },
      description: { type: String },
   },
   {
      collection: "Products",
      timestamps: true,
   }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
