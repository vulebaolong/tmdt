"use server";

import { toJson } from "@/helpers/function.helper";
import { deleteImageCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary-helper";
import { connectDB } from "@/lib/mongoose";
import Service, { IService } from "@/schemas/service.schema";
import { TGetServiceList } from "@/tantask/service.tanstack";
import { TResPagination } from "@/types/app.type";
import { SortOrder } from "mongoose";

export type TGetServices = {
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

export async function getServiceListAction({ pagination, filters = {}, sort }: TGetServices): Promise<TResPagination<IService>> {
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
         Service.countDocuments(query),
         Service.find(query).sort(sortOption).skip(skip).limit(pageSize).lean(),
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
      console.error("Get Service List Failed:", error);
      throw error;
   }
}

export type TCreateServiceAction = IService & {
   title: string;
   content: string;
   thumbnail: FormData;
};
export async function createServiceAction(serviceCreate: TCreateServiceAction) {
   const uploadedImages: { key: string; public_id: string | undefined }[] = [];

   try {
      const dataCreate = { ...serviceCreate };
      for (const [key, value] of Object.entries(serviceCreate)) {
         if (value instanceof FormData) {
            const fileImage = value.get(key) as File;
            if (fileImage instanceof File) {
               const uploaded = await uploadImageToCloudinary(fileImage, "services");
               (dataCreate as any)[key] = uploaded?.public_id;
               uploadedImages.push({ key, public_id: uploaded?.public_id });
            }
         }
      }

      console.log({ dataCreate });

      await connectDB();

      const serviceNew = await Service.create(dataCreate);

      return toJson(serviceNew);
   } catch (error) {
      for (const img of uploadedImages) {
         await deleteImageCloudinary(img.public_id);
      }
      console.error("Create Service Failed", error);
      throw error;
   }
}

export type TUpdateServiceAction = IService & {
   _id: string;
   title: string;
   content: string;
   thumbnail: FormData | string;
};
export async function updateServiceAction(updateService: TUpdateServiceAction) {
   const uploadedImages: { key: string; public_id: string | undefined }[] = [];

   try {
      const dataUpdate = { ...updateService };

      await connectDB();

      const serviceExist = await Service.findById(updateService._id);
      if (!serviceExist) throw new Error("Service not found");

      for (const [key, value] of Object.entries(updateService)) {
         if (value instanceof FormData) {
            const file = value.get(key) as File;
            if (file) {
               await deleteImageCloudinary((serviceExist as any)[key]);
               const uploaded = await uploadImageToCloudinary(file, "services");
               (dataUpdate as any)[key] = uploaded?.public_id;
               uploadedImages.push({ key, public_id: uploaded?.public_id });
            }
         }
      }

      await Service.updateOne(
         { _id: dataUpdate._id },
         {
            $set: dataUpdate,
         }
      );

      return true;
   } catch (error) {
      for (const img of uploadedImages) {
         await deleteImageCloudinary(img.public_id);
      }
      console.error("Update Service Failed", error);
      throw error;
   }
}

export async function deleteServiceAction(id: string) {
   try {
      await connectDB();
      const serviceDelete = await Service.findByIdAndDelete(id);
      if (serviceDelete?.thumbnail) await deleteImageCloudinary(serviceDelete.thumbnail);
      return true;
   } catch (error) {
      console.error("Delete Service Failed", error);
      throw error;
   }
}

export async function getServiceByIdAction(id: string) {
   try {
      await connectDB();
      const service = await Service.findOne({ _id: id }).lean();
      return toJson(service);
   } catch (error) {
      console.error("Get Service By Id Failed", error);
      throw error;
   }
}

export async function getServiceListAction2({
   page = 1,
   category,
}: TGetServiceList): Promise<TResPagination<IService>> {
   try {
      await connectDB();

      const pageSize = 10

      const skip = (page - 1) * pageSize;

      const filter: any = {};

      // Filter category
      if (category) {
         const categoryArray = category.split(",").map((item) => Number(item.trim()));
         filter.category = { $in: categoryArray };
      }

      const [itemCount, items] = await Promise.all([
         Service.countDocuments(filter),
         Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      ]);

      const pageCount = Math.ceil(itemCount / pageSize);

      return {
         page,
         pageSize,
         pageCount,
         itemCount,
         items: toJson(items),
         filterable: [],
         sortable: [],
      };
   } catch (error) {
      console.error("Get List Product Failed", error);
      throw error;
   }
}
