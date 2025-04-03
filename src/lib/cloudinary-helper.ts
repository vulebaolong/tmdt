import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "@/constant/app.constant";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(file: File, folder: string) {
   if (!file) return null;

   const buffer = Buffer.from(await file.arrayBuffer());

   return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
         if (error) return reject(error);
         resolve({
            url: result?.secure_url || "",
            public_id: result?.public_id || "",
         });
      });

      stream.end(buffer);
   });
}

export async function deleteImageCloudinary(publicId?: string) {
   if(!publicId) return
   return cloudinary.uploader.destroy(publicId);
}
