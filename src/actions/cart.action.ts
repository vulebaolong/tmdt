"use server";

import { connectDB } from "@/lib/mongoose";
import Cart from "@/schemas/cart.schema";
import { getInfoAction } from "./auth.action";
import mongoose from "mongoose";

export type TAddToCartAction = { productId: string; quantity: number };

export async function addToCartAction({ productId, quantity }: TAddToCartAction) {
   try {
      await connectDB();

      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      const cart = await Cart.findOne({ userId: info._id });

      if (cart) {
         const existingProduct = cart.products.find((p: any) => p.productId.toString() === productId);

         if (existingProduct) {
            existingProduct.quantity += quantity;
         } else {
            cart.products.push({
               productId: new mongoose.Types.ObjectId(productId),
               quantity,
            });
         }

         await cart.save();
      } else {
         await Cart.create({
            userId: info._id,
            products: [{ productId: new mongoose.Types.ObjectId(productId), quantity }],
         });
      }

      return { success: true };
   } catch (error) {
      console.error("Add to cart failed", error);
      throw new Error("Add to cart failed");
   }
}

export async function getCartCountAction() {
   try {
      await connectDB();

      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      const cart = await Cart.findOne({ userId: info._id }).lean();
      if (!cart || !cart.products) return 0;

      const count = cart.products.reduce((acc, item) => acc + item.quantity, 0);
      console.log({ count });
      return count;
   } catch (error) {
      console.error("Get Cart Count Failed", error);
      throw new Error("Get Cart Count Failed");
   }
}
