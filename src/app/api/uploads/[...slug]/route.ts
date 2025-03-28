import fs from "fs";
import path from "path";

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
   try {
      const filePath = path.join(process.cwd(), "public", "uploads", ...params.slug);

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
   } catch (error) {
      console.error("Serve image failed:", error);
      return new Response("Internal Server Error", { status: 500 });
   }
}
