"use server";

import { connectDB } from "@/lib/mongoose";
import Product, { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";

export async function getProductListAction(page: number): Promise<TResPagination<IProduct[]>> {
   try {
      await connectDB();

      console.log({ page });

      const pageSize = 4;
      const skip = (page - 1) * pageSize;

      const [totalItems, items] = await Promise.all([
         Product.countDocuments(),
         Product.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      console.log({ page, totalPages });

      return {
         page,
         pageSize,
         totalPages,
         totalItems,
         items: JSON.parse(JSON.stringify(items)), // đảm bảo JSON-safe
      };
   } catch (error) {
      console.error("Get List Product Failed", error);
      throw error;
   }
}

export async function getProductByIdAction(id: string) {
   try {
      await connectDB();
      const product = await Product.findOne({ _id: id }).lean();
      return JSON.parse(JSON.stringify(product));
   } catch (error) {
      console.error("Get Product By Id Failed", error);
   }
}
