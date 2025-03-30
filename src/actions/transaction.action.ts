// actions/check-transaction.action.ts
"use server";

import { connectDB } from "@/lib/mongoose";
import Transaction from "@/schemas/transaction.schema";

export async function checkTransactionAction( userId: any, lastId?: any,) {
   try {
      await connectDB();

      const latestTransaction = await Transaction.findOne({ userId: userId }).sort({ createdAt: -1 }).lean();

      if (!latestTransaction) return { hasNew: false, lastId: null };

      if (lastId === undefined) {
         return { hasNew: false, lastId: latestTransaction._id.toString() };
      }

      const hasNew = latestTransaction._id.toString() !== lastId;

      return { hasNew, lastId: latestTransaction._id.toString() };
   } catch (error) {
      console.error(error);
      return { hasNew: false };
   }
}
