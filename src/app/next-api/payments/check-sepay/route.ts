import { connectDB } from "@/lib/mongoose";
import Transaction from "@/schemas/transaction.schema";
import { NextRequest, NextResponse } from "next/server";

// {
//    "id": 92704,                              // ID giao dịch trên SePay
//    "gateway":"Vietcombank",                  // Brand name của ngân hàng
//    "transactionDate":"2023-03-25 14:02:37",  // Thời gian xảy ra giao dịch phía ngân hàng
//    "accountNumber":"0123499999",              // Số tài khoản ngân hàng
//    "code":null,                               // Mã code thanh toán (sepay tự nhận diện dựa vào cấu hình tại Công ty -> Cấu hình chung)
//    "content":"chuyen tien mua iphone",        // Nội dung chuyển khoản
//    "transferType":"in",                       // Loại giao dịch. in là tiền vào, out là tiền ra
//    "transferAmount":2277000,                  // Số tiền giao dịch
//    "accumulated":19077000,                    // Số dư tài khoản (lũy kế)
//    "subAccount":null,                         // Tài khoản ngân hàng phụ (tài khoản định danh),
//    "referenceCode":"MBVCB.3278907687",         // Mã tham chiếu của tin nhắn sms
//    "description":""                           // Toàn bộ nội dung tin nhắn sms
// }
// {
//    gateway: 'ACB',
//    transactionDate: '2025-03-31 10:27:16',
//    accountNumber: '14553261',
//    subAccount: null,
//    code: 'tmdt6',
//    content: 'tmdt67e6e72a0c6de4022a2b1852-67e5783f2eb764faf541637e- GD 517556-033125 10:27:16',
//    transferType: 'in',
//    description: 'BankAPINotify tmdt67e6e72a0c6de4022a2b1852-67e5783f2eb764faf541637e- GD 517556-033125 10:27:16',
//    transferAmount: 10000,
//    referenceCode: '2701',
//    accumulated: 0,
//    id: 10481786
//  }

export async function POST(req: NextRequest) {
   try {
      await connectDB();
      const body = await req.json();

      console.log("[WEBHOOK]", body);

      const idMatch = body.content?.match(/tmdt([a-f0-9]{24})-([a-f0-9]{24})-/i);
      const productId = idMatch ? idMatch[1] : null;
      const userId = idMatch ? idMatch[2] : null;

      const data = {
         accountNumber: body.accountNumber,
         balance: Number(body.accumulated),
         amount: Number(body.transferAmount),
         transactionContent: body.content,
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
