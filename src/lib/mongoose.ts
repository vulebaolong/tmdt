import { MONGODB_URI } from "@/constant/app.constant";
import mongoose from "mongoose";

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
   if (!MONGODB_URI) throw new Error("MONGODB_URI chưa được cấu hình");
   if (cached.conn) return cached.conn;
   if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
         dbName: "db_tmdt",
      });
   }
   cached.conn = await cached.promise;
   return cached.conn;
}
