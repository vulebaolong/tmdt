"use server";

import { toJson } from "@/helpers/function.helper";
import { deleteImageCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary-helper";
import { connectDB } from "@/lib/mongoose";
import Product, { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { TCreateProductReq } from "@/types/product.type";
import fs from "fs";
import { SortOrder } from "mongoose";
import path from "path";

export async function getProductListAction2(page: number): Promise<TResPagination<IProduct>> {
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

      console.log({ query });
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
      const linkImage = await uploadImageToCloudinary(imageFromData);
      console.log({linkImage});
      if (!linkImage) throw new Error(`No file`);

      await connectDB();

      const productNew = await Product.create({
         name: product.name,
         tags: product.tags,
         price: product.price,
         images: [linkImage.url],
         imagePublicId: linkImage.public_id, // lưu thêm id để xóa sau này
         sold: 0,
      });

      return toJson(productNew);
   } catch (error) {
      console.error("Create Product Failed", error);
      throw error;
   }
}

export async function updateProductAction({ imageFromData, ...product }: any) {
   try {
      await connectDB();

      const updateData: any = {
         name: product.name,
         tags: product.tags,
         price: product.price,
      };

      if (imageFromData) {
         await deleteImageCloudinary(product.imagePublicId);
         const linkImage = await uploadImageToCloudinary(imageFromData);
         if (linkImage) {
            updateData.images = [linkImage.url];
            updateData.imagePublicId = linkImage.public_id;
         }
      }

      const productUpdated = await Product.findByIdAndUpdate(product._id, updateData, { new: true });

      if (!productUpdated) throw new Error("Product not found");

      return toJson(productUpdated);
   } catch (error) {
      console.error("Update Product Failed", error);
      throw error;
   }
}

export async function deleteProductAction(id: string) {
   try {
      await connectDB();
      const productDelete = await Product.findByIdAndDelete(id);

      if (productDelete?.imagePublicId) {
         await deleteImageCloudinary(productDelete.imagePublicId);
      }

      return true;
   } catch (error) {
      console.error("Delete Product Failed", error);
      throw error;
   }
}

export async function createImage(formData: FormData) {
   const file = formData.get("file") as File;
   if (!file) return null;

   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const fileExtension = path.extname(file.name);
   const fileName = `${Date.now()}${fileExtension}`;
   const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

   // Tạo thư mục nếu chưa có
   fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
   fs.writeFileSync(uploadPath, buffer);

   return `/uploads/${fileName}`;
}

export async function deleteImage(linkImage: string) {
   try {
      if (!linkImage) return;

      const filePath = path.join(process.cwd(), "public", linkImage);

      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
         console.log(`Đã xóa file: ${filePath}`);
      } else {
         console.warn(`File không tồn tại: ${filePath}`);
      }
   } catch (error) {
      console.error("Xóa file thất bại:", error);
   }
}
