"use server"

import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { uploadImageToCloudinary, deleteImageCloudinary } from "@/lib/cloudinary-helper";
import { connectDB } from "@/lib/mongoose";
import Setting from "@/schemas/setting.schema";

export async function uploadLogoAction(file: File) {
   await connectDB();

   const LOGO_KEY = "siteLogo";

   // Lấy logo hiện tại
   const currentSetting = await Setting.findOne({ key: LOGO_KEY });

   // Xóa logo cũ nếu có
   if (currentSetting?.value) {
      await deleteImageCloudinary(currentSetting.value);
   }

   // Upload logo mới
   const result = await uploadImageToCloudinary(file, "logo");

   // Ghi đè setting
   await Setting.findOneAndUpdate({ key: LOGO_KEY }, { key: LOGO_KEY, value: result?.public_id }, { upsert: true, new: true });

   return result?.public_id;
}

export async function getSiteLogo() {
   await connectDB();
   const setting = await Setting.findOne({ key: "siteLogo" });
   return setting?.value ? `${BASE_DOMAIN_CLOUDINARY}/${setting.value}` : "/logo/logo-icon.png";
}