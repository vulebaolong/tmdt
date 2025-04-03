"use server";

import { TIME_LEFT_ORDER } from "@/constant/app.constant";
import { toJson } from "@/helpers/function.helper";
import { connectDB } from "@/lib/mongoose";
import Order, { IOrder } from "@/schemas/order.schema";
import { EOrderPaymentMethod } from "@/types/enum/order.enum";
import { Types } from "mongoose";
import { getInfoAction } from "./auth.action";

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
      if (!info) throw new Error("Please login");

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

export async function deleteOrderAction(id: string) {
   try {
      await connectDB();
      const deletedOrder = await Order.findByIdAndDelete(id).lean();

      if (!deletedOrder) return { success: false, message: "Order not found" };

      return { success: true, message: "Order deleted successfully" };
   } catch (error) {
      console.error("Delete Order Error:", error);
      throw error;
   }
}

export async function checkPendingOrderAction() {
   try {
      await connectDB();

      const info = await getInfoAction();
      if (!info) throw new Error("Please login");

      const pendingOrder = await Order.findOne({
         userId: info._id,
         status: 0, // Pending
         expiresAt: { $gt: new Date() },
      }).lean();

      if (!pendingOrder) return false;

      return pendingOrder._id.toString();
   } catch (error) {
      console.error("Check Pending Order Error:", error);
      throw error;
   }
}
