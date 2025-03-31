import { checkTransactionAction } from "@/actions/transaction.action";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const useCheckTransaction = () => {
   const lastIdRef = useRef<string | undefined | null>(undefined);
   const info = useAppSelector((state) => state.user.info);

   return useQuery({
      queryKey: ["check-transaction", info?._id],
      queryFn: async () => {
         if (info?._id) {
            const res = await checkTransactionAction( info._id, lastIdRef.current);

            lastIdRef.current = res.lastId;

            return res;
         } else {
            return { hasNew: false };
         }
      },
      // refetchInterval: !!info?._id && 1000,
   });
};
