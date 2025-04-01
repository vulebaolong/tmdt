import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IOrderItem {
   productId: Types.ObjectId;
   quantity: number;
   price: number;
   shippingFee: number;
}

export interface IOrder extends Document {
   userId: Types.ObjectId;
   products: IOrderItem[];
   totalPrice: number;
   status: "pending" | "paid";
   paymentMethod: "momo" | "zalopay" | "vietqr";
   expiresAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
   {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      shippingFee: { type: Number, required: true },
   },
   { _id: false }
);

const OrderSchema = new Schema<IOrder>(
   {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      products: { type: [OrderItemSchema], required: true },
      totalPrice: { type: Number, required: true },
      status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
      paymentMethod: { type: String, enum: ["momo", "zalopay", "vietqr"], required: true },
      expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
   },
   { timestamps: true, collection: "Orders" }
);

OrderSchema.pre("save", function (next) {
   if (this.status === "pending" && !this.expiresAt) {
      this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
   }
   next();
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
