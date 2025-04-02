// actions/check-transaction.action.ts
"use server";

import { toJson } from "@/helpers/function.helper";
import { connectDB } from "@/lib/mongoose";
import Transaction, { ITransaction } from "@/schemas/transaction.schema";
import { TResPagination } from "@/types/app.type";
import { SortOrder } from "mongoose";

export async function checkTransactionAction(userId: any, lastId?: any) {
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

export type TGetTransactions = {
   pagination: {
      pageIndex: number;
      pageSize: number;
   };
   filters?: Record<string, any>;
   sort?: {
      sortBy?: string;
      isDesc?: boolean;
   };
};

export async function getTransactionListAction({ pagination, filters = {}, sort }: TGetTransactions): Promise<TResPagination<ITransaction>> {
   try {
      await connectDB();

      const { pageIndex, pageSize } = pagination;
      const skip = (pageIndex - 1) * pageSize;

      // 1. Xây dựng query filter LINH HOẠT
      const query: any = {};

      Object.entries(filters).forEach(([key, value]) => {
         if (value !== undefined && value !== "") {
            if (key === "fromTime" || key === "toTime") {
               query.createdAt = query.createdAt || {};
               if (key === "fromTime") query.createdAt.$gte = new Date(value);
               if (key === "toTime") query.createdAt.$lte = new Date(value);
            } else {
               query[key] = value;
            }
         }
      });

      // 2. Xử lý sort
      const sortOption: Record<string, SortOrder> = sort?.sortBy ? { [sort.sortBy]: sort.isDesc ? -1 : 1 } : { createdAt: -1 };

      console.log({ query });
      // 3. Truy vấn DB
      const [itemCount, items] = await Promise.all([
         Transaction.countDocuments(query),
         Transaction.find(query).populate("orderId").sort(sortOption).skip(skip).limit(pageSize).lean(),
      ]);

      const pageCount = Math.ceil(itemCount / pageSize);

      return {
         page: pageIndex,
         pageSize,
         pageCount,
         itemCount,
         items: toJson(items),
         filterable: [],
         sortable: [],
      };
   } catch (error) {
      console.error("Get Transaction List Failed:", error);
      throw error;
   }
}
