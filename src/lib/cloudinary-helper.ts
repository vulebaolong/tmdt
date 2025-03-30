// import cloudinary from "./cloudinary";

export async function uploadImageToCloudinary(formData: FormData) {
   const file = formData.get("file") as File;
   if (!file) return null;

   // const buffer = Buffer.from(await file.arrayBuffer());

   return new Promise<{ url: string; public_id: string }>(() => {
      // const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
      //    if (error) return reject(error);
      //    resolve({
      //       url: result?.secure_url || "",
      //       public_id: result?.public_id || "",
      //    });
      // });

      // stream.end(buffer);
   });
}

export async function deleteImageCloudinary(publicId: string) {
   console.log(publicId);
   // return cloudinary.uploader.destroy(publicId);
}
