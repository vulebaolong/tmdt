import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: any) {
   const slug = context.params.slug;
   const filePath = path.join(process.cwd(), "public", "uploads", ...slug);

   if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
   }

   const file = fs.readFileSync(filePath);
   const ext = path.extname(filePath).substring(1);
   const contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

   return new Response(file, {
      headers: {
         "Content-Type": contentType,
         "Cache-Control": "public, max-age=31536000, immutable",
      },
   });
}
