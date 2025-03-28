"use server";

import { toJson } from "@/helpers/function.helper";
import { connectDB } from "@/lib/mongoose";
import Product, { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { TCreateProductReq } from "@/types/product.type";
import fs from "fs";
import { SortOrder } from "mongoose";
import path from "path";

export async function getProductListAction2(page: number): Promise<TResPagination<IProduct[]>> {
   try {
      await connectDB();

      console.log({ page });

      const pageSize = 4;
      const skip = (page - 1) * pageSize;

      const [itemCount, items] = await Promise.all([
         Product.countDocuments(),
         Product.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      ]);

      const pageCount = Math.ceil(itemCount / pageSize);

      return {
         page,
         pageSize,
         pageCount,
         itemCount,
         items: JSON.parse(JSON.stringify(items)), // đảm bảo JSON-safe
         filterable: [],
         sortable: [],
      };
   } catch (error) {
      console.error("Get List Product Failed", error);
      throw error;
   }
}

export type TGetProducts = {
   pagination: {
      pageIndex: number;
      pageSize: number;
   };
   filters?: Record<string, any>;
   sort?: {
      sortBy?: string;
      isDesc?: boolean;
   };
};

export async function getProductListAction({ pagination, filters = {}, sort }: TGetProducts): Promise<TResPagination<IProduct>> {
   try {
      await connectDB();

      const { pageIndex, pageSize } = pagination;
      const skip = (pageIndex - 1) * pageSize;

      // 1. Xây dựng query filter LINH HOẠT
      const query: any = {};

      Object.entries(filters).forEach(([key, value]) => {
         if (value !== undefined && value !== "") {
            if (key === "fromTime" || key === "toTime") {
               query.createdAt = query.createdAt || {};
               if (key === "fromTime") query.createdAt.$gte = new Date(value);
               if (key === "toTime") query.createdAt.$lte = new Date(value);
            } else {
               query[key] = value;
            }
         }
      });

      // 2. Xử lý sort
      const sortOption: Record<string, SortOrder> = sort?.sortBy ? { [sort.sortBy]: sort.isDesc ? -1 : 1 } : { createdAt: -1 };


      console.log({query});
      // 3. Truy vấn DB
      const [itemCount, items] = await Promise.all([
         Product.countDocuments(query),
         Product.find(query).sort(sortOption).skip(skip).limit(pageSize).lean(),
      ]);

      const pageCount = Math.ceil(itemCount / pageSize);

      return {
         page: pageIndex,
         pageSize,
         pageCount,
         itemCount,
         items: toJson(items),
         filterable: [],
         sortable: [],
      };
   } catch (error) {
      console.error("Get Product List Failed:", error);
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

export async function createProductAction({ imageFromData, ...product }: TCreateProductReq) {
   try {
      const file = imageFromData.get("file") as File;
      console.log({ file, product });
      if (!file) throw new Error(`No file`);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

      // Tạo thư mục nếu chưa có
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      fs.writeFileSync(uploadPath, buffer);

      await connectDB();

      const productNew = await Product.create({
         name: product.name,
         tags: product.tags,
         price: product.price,
         images: [`/uploads/${fileName}`],
         sold: 0,
      });

      return toJson(productNew);
   } catch (error) {
      console.error("Create Product Failed", error);
      throw error;
   }
}
