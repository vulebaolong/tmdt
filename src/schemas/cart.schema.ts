import mongoose, { Model, Schema } from "mongoose";

export interface ICartItem {
   productId: mongoose.Types.ObjectId;
   quantity: number;
}

export interface ICart {
   userId: mongoose.Types.ObjectId;
   products: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
   {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
   },
   { _id: false }
);

const CartSchema = new Schema<ICart>(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
      products: [CartItemSchema],
   },
   { timestamps: true, collection: "Carts" }
);

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
