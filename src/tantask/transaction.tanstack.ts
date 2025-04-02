import { getTransactionListAction, TGetTransactions } from "@/actions/transaction.action";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = (params: TGetTransactions) => {
   return useQuery({
      queryKey: ["transactions", params],
      queryFn: async () => {
         const products = await getTransactionListAction(params);
         console.log({ products });
         return products;
      },
   });
};