"use server";

import fs from "fs";
import path from "path";

export async function uploadImage(formData: FormData) {
   const file = formData.get("file") as File;
   console.log({ file });
   if (!file) return { error: "No file" };

   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const fileName = `${Date.now()}-${file.name}`;
   const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

   // Tạo thư mục nếu chưa có
   fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
   fs.writeFileSync(uploadPath, buffer);

   return `/uploads/${fileName}`;
}
