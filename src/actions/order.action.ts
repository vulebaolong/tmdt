"use server";

import { connectDB } from "@/lib/mongoose";
import { getInfoAction } from "./auth.action";
import Order, { IOrder } from "@/schemas/order.schema";
import { Types } from "mongoose";
import { toJson } from "@/helpers/function.helper";
import { EOrderPaymentMethod } from "@/types/enum/order.enum";
import { TIME_LEFT_ORDER } from "@/constant/app.constant";

export type TCreateOrder = {
   products: { productId: string; quantity: number; price: number; shippingFee: number }[];
   totalPriceItemCart: number;
   totalShipItemCart: number;
   totalPrice: number;
   paymentMethod: EOrderPaymentMethod;
};

export async function createOrderAction(payload: TCreateOrder) {
   try {
      await connectDB();

      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      console.log({ createOrderAction: payload });

      const newOrder = await Order.create({
         userId: new Types.ObjectId(info._id as string),
         products: payload.products.map((item) => ({
            productId: new Types.ObjectId(item.productId),
            quantity: item.quantity,
            price: item.price,
            shippingFee: item.shippingFee,
         })),
         totalPriceItemCart: payload.totalPriceItemCart,
         totalShipItemCart: payload.totalShipItemCart,
         totalPrice: payload.totalPrice,
         paymentMethod: payload.paymentMethod,
         expiresAt: payload.paymentMethod === EOrderPaymentMethod[`Cash on Delivery`] ? undefined : new Date(Date.now() + TIME_LEFT_ORDER),
      });

      return { success: true, data: toJson(newOrder) };
   } catch (error) {
      throw error;
   }
}

export async function getOrderByIdAction(id: string) {
   try {
      await connectDB();

      const order = await Order.findById(id)
         // .populate("userId", "-password") // Populate nếu muốn
         .populate("products.productId")
         .lean();

      if (!order) return { success: false, message: "Order not found" };

      return { success: true, data: toJson<IOrder>(order) };
   } catch (error) {
      console.error("Get Order By Id Failed", error);
      return { success: false, message: "Failed to get order" };
   }
}
