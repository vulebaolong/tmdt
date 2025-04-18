"use server";

import { toJson } from "@/helpers/function.helper";
import { connectDB } from "@/lib/mongoose";
import User from "@/schemas/user.schema";

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