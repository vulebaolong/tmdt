import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "@/constant/app.constant";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(formData: FormData) {
   const file = formData.get("file") as File;
   if (!file) return null;

   const buffer = Buffer.from(await file.arrayBuffer());

   return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
         if (error) return reject(error);
         resolve({
            url: result?.secure_url || "",
            public_id: result?.public_id || "",
         });
      });

      stream.end(buffer);
   });
}

export async function deleteImageCloudinary(publicId: string) {
   return cloudinary.uploader.destroy(publicId);
}
