"use server";

import { connectDB } from "@/lib/mongoose";
import { getInfoAction } from "./auth.action";
import Order from "@/schemas/order.schema";
import { Types } from "mongoose";

export type TCreateOrder = {
   products: { productId: string; quantity: number; price: number; shippingFee: number }[];
   totalPrice: number;
   paymentMethod: "momo" | "zalopay" | "vietqr";
};

export async function createOrderAction(payload: TCreateOrder) {
   try {
      await connectDB();

      const info = await getInfoAction();

      if (!info) throw new Error("Unauthorized");

      await Order.create({
         userId: new Types.ObjectId(info._id as string),
         products: payload.products.map((item) => ({
            productId: new Types.ObjectId(item.productId),
            quantity: item.quantity,
            price: item.price,
            shippingFee: item.shippingFee,
         })),
         totalPrice: payload.totalPrice,
         paymentMethod: payload.paymentMethod,
         expiresAt: new Date(Date.now() + 10000),
      });

      return { success: true };
   } catch (error) {
      console.error("Create Order Error:", error);
      throw error;
   }
}
