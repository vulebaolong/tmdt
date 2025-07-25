import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
   name: string;
   imagePublicId: string;
   imagePublicIds: string[];
   tags: number[];
   category: number[];
   shippingFee: number;
   price: number;
   sold: number;
   inStock: boolean;
   brand: string;
   description: string;
   content: string;
   createdAt: Date
}

const ProductSchema = new Schema<IProduct>(
   {
      name: { type: String, required: true },
      imagePublicId: { type: String},
      imagePublicIds: { type: [String], default: [] },
      tags: { type: [Number], default: [] },
      category: { type: [Number], default: [] },
      shippingFee: { type: Number, required: true },
      price: { type: Number, required: true },
      sold: { type: Number, default: 0 },
      inStock: { type: Boolean, default: true },
      brand: { type: String },
      description: { type: String },
      content: { type: String },
   },
   {
      collection: "Products",
      timestamps: true,
   }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
