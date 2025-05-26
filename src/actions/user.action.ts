"use server";

import { toJson } from "@/helpers/function.helper";
import { deleteImageCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary-helper";
import { connectDB } from "@/lib/mongoose";
import User, { TUser } from "@/schemas/user.schema";
import { TResPagination } from "@/types/app.type";
import { SortOrder } from "mongoose";

export type TUpdateProfile = {
   userId: string;
   phone?: string;
   address?: string;
};

export async function updateProfileAction({ userId, phone, address }: TUpdateProfile) {
   try {
      await connectDB();

      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { ...(phone && { phone }), ...(address && { address }) },
         { new: true }
      ).lean();

      if (!updatedUser) throw new Error("User not found");

      return { success: true, data: toJson(updatedUser) };
   } catch (error) {
      console.error("Update Profile Error", error);
      return { success: false, message: "Update profile failed" };
   }
}

export type TGetUsers = {
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

export async function getUserListAction({ pagination, filters = {}, sort }: TGetUsers): Promise<TResPagination<TUser>> {
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
         User.countDocuments(query),
         User.find(query).sort(sortOption).skip(skip).limit(pageSize).lean(),
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

export type TUpdateUserAction = TUser & { imageFromData: FormData | string };
export async function updateUserAction(updateUser: TUpdateUserAction) {
   const uploadedImages: { key: string; public_id: string | undefined }[] = [];

   try {
      const dataUpdate = { ...updateUser };

      await connectDB();

      const productExist = await User.findById(updateUser._id);
      if (!productExist) throw new Error("Service not found");

      for (const [key, value] of Object.entries(updateUser)) {
         if (value instanceof FormData) {
            const file = value.get(key) as File;
            if (file) {
               await deleteImageCloudinary((productExist as any)[key]);
               const uploaded = await uploadImageToCloudinary(file, "products");
               (dataUpdate as any)[key] = uploaded?.public_id;
               uploadedImages.push({ key, public_id: uploaded?.public_id });
            }
         }
      }

      await User.updateOne(
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
      console.error("Update User Failed", error);
      throw error;
   }
}