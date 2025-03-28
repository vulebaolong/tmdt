// models/Product.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
   name: string;
   images: string[];
   imagePublicId: string;
   tags: number[];
   price: number;
   sold: number;
   createdAt: Date;
   updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
   {
      name: { type: String, required: true },
      images: { type: [String], required: true },
      imagePublicId: { type: String, required: true },
      tags: { type: [Number], default: [] },
      price: { type: Number, required: true },
      sold: { type: Number, default: 0 },
   },
   {
      collection: "Products",
      timestamps: true,
   }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
