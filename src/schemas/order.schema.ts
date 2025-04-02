import { EOrderPaymentMethod, EOrderStatus } from "@/types/enum/order.enum";
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
   totalPriceItemCart: number,
   totalShipItemCart: number,
   status: EOrderStatus;
   paymentMethod: EOrderPaymentMethod;
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
      totalPriceItemCart: { type: Number, required: true },
      totalShipItemCart: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      status: { type: Number, enum: Object.values(EOrderStatus).filter((v) => typeof v === "number"), default: EOrderStatus.Pending },
      paymentMethod: { type: Number, enum: Object.values(EOrderPaymentMethod).filter((v) => typeof v === "number"), required: true },
      expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
   },
   { timestamps: true, collection: "Orders" }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
