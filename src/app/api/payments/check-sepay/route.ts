import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();

      console.log("[SEEPAY WEBHOOK]", body);

      // ✅ TODO: Kiểm tra chữ ký hoặc token bảo mật (nếu Seepay cung cấp)
      // ✅ TODO: Lưu thông tin vào DB, cập nhật trạng thái thanh toán

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error("Webhook Seepay Error:", error);
      return NextResponse.json({ success: false, error: "Invalid Request" }, { status: 400 });
   }
}
