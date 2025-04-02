"use server";

import { connectDB } from "@/lib/mongoose";
import Cart from "@/schemas/cart.schema";
import { getInfoAction } from "./auth.action";
import mongoose from "mongoose";
import { toJson } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";

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
      
      return count;
   } catch (error) {
      console.error("Get Cart Count Failed", error);
      throw new Error("Get Cart Count Failed");
   }
}

export type TPayloadGetCart = {
   page?: number;
   pageSize?: number;
   searchKey?: string;
   searchValue?: string;
};


export interface ICartItemPopulated {
   productId: IProduct;
   quantity: number;
}

export interface ICartPopulated {
   userId: string;
   products: ICartItemPopulated[];
}
export async function getCartListAction(payload: TPayloadGetCart) {
   try {
      await connectDB();

      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      const { page = 1, pageSize = 10, searchKey, searchValue } = payload;
      const skip = (page - 1) * pageSize;

      const filter: any = {};
      if (searchKey && searchValue) {
         filter[searchKey] = { $regex: searchValue, $options: "i" };
      }

      const items = await Cart.findOne({userId: info._id }).populate("products.productId").skip(skip).limit(pageSize).lean<ICartPopulated>();
      console.log({ items: items?.products });

      return {
         page,
         pageSize,
         pageCount: Math.ceil(items?.products.length || 0 / pageSize),
         totalItem: items?.products.length,
         items: items?.products ? toJson(items?.products) : [],
      };
   } catch (error) {
      console.error("Get Cart List Error:", error);
      throw error;
   }
}

export async function updateQuantityAction(payload: { productId: string; quantity: number }) {
   try {
      await connectDB();
      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      const cart = await Cart.findOne({ userId: info._id });
      if (!cart) throw new Error("Cart not found");

      const product = cart.products.find((p) => p.productId.toString() === payload.productId);
      if (!product) throw new Error("Product not found in cart");

      product.quantity = payload.quantity;
      await cart.save();

      return { success: true };
   } catch (error) {
      console.error("Update quantity failed", error);
      throw error;
   }
}

type TPayloadDeleteCart = {
   productId: string;
};

export async function deleteCartItemAction(payload: TPayloadDeleteCart) {
   try {
      await connectDB();
      const info = await getInfoAction();
      if (!info) throw new Error("Unauthorized");

      await Cart.updateOne({ userId: info._id }, { $pull: { products: { productId: payload.productId } } });

      return { success: true };
   } catch (error) {
      console.error("Delete Cart Item Error", error);
      throw error;
   }
}
