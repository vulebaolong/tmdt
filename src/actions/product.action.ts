"use server";

import { toJson } from "@/helpers/function.helper";
import { deleteImageCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary-helper";
import { connectDB } from "@/lib/mongoose";
import Product, { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import fs from "fs";
import { SortOrder } from "mongoose";
import path from "path";

export type TPayloadGetProductList = {
   page: number;
   pageSize?: number;
   category?: string;
   searchProduct?: string;
};

export async function getProductListAction2({
   page = 1,
   pageSize = 10,
   category,
   searchProduct,
}: TPayloadGetProductList): Promise<TResPagination<IProduct>> {
   try {
      await connectDB();

      const skip = (page - 1) * pageSize;

      const filter: any = {};

      // Filter category
      if (category) {
         const categoryArray = category.split(",").map((item) => Number(item.trim()));
         filter.category = { $in: categoryArray };
      }

      // Filter search
      if (searchProduct) {
         filter.name = { $regex: searchProduct, $options: "i" };
      }

      const [totalItem, items] = await Promise.all([
         Product.countDocuments(filter),
         Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      ]);

      const totalPage = Math.ceil(totalItem / pageSize);

      return {
         page,
         pageSize,
         totalPage,
         totalItem,
         items: toJson(items),
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
      const [totalItem, items] = await Promise.all([
         Product.countDocuments(query),
         Product.find(query).sort(sortOption).skip(skip).limit(pageSize).lean(),
      ]);

      const totalPage = Math.ceil(totalItem / pageSize);

      return {
         page: pageIndex,
         pageSize,
         totalPage,
         totalItem,
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
      throw error;
   }
}

export type TCreateProductAction = IProduct & { imageFromData: FormData };
export async function createProductAction(productCreate: TCreateProductAction) {
   const uploadedImages: { key: string; public_id: string | undefined }[] = [];

   try {
      const dataCreate = { ...productCreate };
      const uploadPromises: Promise<void>[] = [];

      for (const [key, value] of Object.entries(productCreate)) {
         // 1. Trường đơn: FormData chứa 1 File
         if (value instanceof FormData) {
            const fileImage = value.get(key) as File;
            if (fileImage instanceof File) {
               const promise = uploadImageToCloudinary(fileImage, "products").then((uploaded) => {
                  if (uploaded?.public_id) {
                     (dataCreate as any)[key] = uploaded.public_id;
                     uploadedImages.push({ key, public_id: uploaded.public_id });
                  }
               });
               uploadPromises.push(promise);
            }
         }

         // 2. Trường nhiều ảnh: mảng FormData
         else if (Array.isArray(value) && value.every((v) => v instanceof FormData)) {
            (dataCreate as any)[key] = [];
            const imagePromises = value.map((formData, index) => {
               const file = formData.get(key) as File;
               if (!(file instanceof File)) return Promise.resolve();

               return uploadImageToCloudinary(file, "products").then((uploaded) => {
                  if (!uploaded?.public_id) return;
                  if (!Array.isArray((dataCreate as any)[key])) (dataCreate as any)[key] = [];
                  (dataCreate as any)[key].push(uploaded.public_id);
                  uploadedImages.push({ key: `${key}[${index}]`, public_id: uploaded.public_id });
               });
            });

            uploadPromises.push(...imagePromises);
         }
      }

      await Promise.all(uploadPromises);

      console.log({ dataCreate });

      await connectDB();

      const serviceNew = await Product.create(dataCreate);

      return toJson(serviceNew);
   } catch (error) {
      for (const img of uploadedImages) {
         await deleteImageCloudinary(img.public_id);
      }
      console.error("Create Service Failed", error);
      throw error;
   }
}

export type TUpdateProductAction = IProduct & { imageFromData: FormData | string };
export async function updateProductAction(updateProduct: TUpdateProductAction) {
   const uploadedImages: { key: string; public_id: string | undefined }[] = [];

   try {
      const dataUpdate = { ...updateProduct };

      await connectDB();
      const productExist = await Product.findById(updateProduct._id);
      if (!productExist) throw new Error("Product not found");

      const uploadPromises: Promise<void>[] = [];

      for (const [key, value] of Object.entries(updateProduct)) {
         // 1. Trường đơn (FormData chứa 1 file)
         if (value instanceof FormData) {
            const file = value.get(key) as File;
            if (file instanceof File) {
               const promise = uploadImageToCloudinary(file, "products").then(async (uploaded) => {
                  if (uploaded?.public_id) {
                     // Xoá ảnh cũ nếu có
                     const oldPublicId = (productExist as any)[key];
                     if (oldPublicId) await deleteImageCloudinary(oldPublicId);

                     (dataUpdate as any)[key] = uploaded.public_id;
                     uploadedImages.push({ key, public_id: uploaded.public_id });
                  }
               });
               uploadPromises.push(promise);
            }
         }

         // 2. Trường nhiều ảnh: mảng FormData
         else if (Array.isArray(value) && value.every((v) => v instanceof FormData)) {
            const imagePromises = value.map((formData, index) => {
               const file = formData.get(key) as File;
               if (!(file instanceof File)) {
                  // nếu là chuỗi
                  if (typeof file === `string`) {
                     (dataUpdate as any)[key][index] = file;
                  }
                  return Promise.resolve();
               }
               (dataUpdate as any)[key].splice(index, 1);

               return uploadImageToCloudinary(file, "products").then((uploaded) => {
                  if (!uploaded?.public_id) return;

                  (dataUpdate as any)[key].push(uploaded.public_id);
                  uploadedImages.push({ key: `${key}[${index}]`, public_id: uploaded.public_id });
               });
            });

            uploadPromises.push(...imagePromises);
         }
      }

      console.log({ dataUpdate: dataUpdate.imagePublicIds });
      console.log({ productExist: productExist.imagePublicIds });

      productExist.imagePublicIds.forEach((id) => {
         if (!dataUpdate.imagePublicIds.includes(id)) {
            const deleteOldImages = async () => {
               await deleteImageCloudinary(id);
            };
            uploadPromises.push(deleteOldImages());
         }
      });

      await Promise.all(uploadPromises);

      await Product.updateOne({ _id: dataUpdate._id }, { $set: dataUpdate });

      return true;
   } catch (error) {
      // Rollback ảnh mới đã upload nếu có lỗi
      for (const img of uploadedImages) {
         await deleteImageCloudinary(img.public_id);
      }
      console.error("Update Product Failed", error);
      throw error;
   }
}

export async function deleteProductAction(id: string) {
   try {
      await connectDB();
      const productDelete = await Product.findByIdAndDelete(id);

      const uploadPromises: Promise<void>[] = [];

      if (productDelete?.imagePublicId) {
         uploadPromises.push(deleteImageCloudinary(productDelete.imagePublicId));
      }

      productDelete?.imagePublicIds.forEach((id) => {
         uploadPromises.push(deleteImageCloudinary(id));
      });

      await Promise.all(uploadPromises);

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
