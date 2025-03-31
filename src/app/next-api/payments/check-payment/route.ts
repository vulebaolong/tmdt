import { connectDB } from "@/lib/mongoose";
import Transaction from "@/schemas/transaction.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      await connectDB();
      const body = await req.json();

      console.log("[WEBHOOK]", body);

      const idMatch = body.transactionContent?.match(/tmdt([a-f0-9]{24})-([a-f0-9]{24})-/i);
      const productId = idMatch ? idMatch[1] : null;
      const userId = idMatch ? idMatch[2] : null;

      const data = {
         accountNumber: body.accountNumber,
         balance: Number(body.balance),
         amount: Number(body.amount),
         transactionContent: body.transactionContent,
         transactionDate: body.transactionDate,
         asset: "VND",
         productId: productId,
         userId: userId,
      };

      await Transaction.create(data);

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error("Webhook Error:", error);
      return NextResponse.json({ success: false, error: "Invalid Request" }, { status: 400 });
   }
}
