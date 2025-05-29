import { checkTransactionAction } from "@/actions/transaction.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_IS_CHECK_TRANSACTION, SET_TIME_LEFT } from "@/redux/slices/transaction.slice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export const useCheckTransaction = () => {
   const lastIdRef = useRef<string | undefined | null>(undefined);
   const info = useAppSelector((state) => state.user.info);
   const isCheckTransaction = useAppSelector((state) => state.transaction.isCheckTransaction);
   const dispatch = useAppDispatch();
   const queryClient = useQueryClient();
   const toast = useAppToast();

   return useQuery({
      queryKey: ["check-transaction", info?._id],
      queryFn: async () => {
         if (info?._id) {
            console.log(`check-transaction`);
            const res = await checkTransactionAction(info._id, lastIdRef.current);

            lastIdRef.current = res.lastId;

            if (res?.hasNew) {
               dispatch(SET_IS_CHECK_TRANSACTION(false));
               dispatch(SET_TIME_LEFT(-2));
               queryClient.invalidateQueries({ queryKey: [`get-order-by-id`] });
               queryClient.invalidateQueries({ queryKey: [`cart-count`] });
               toast.success("💰 New transaction just recorded", { autoClose: false });
            }

            return res;
         } else {
            return { hasNew: false };
         }
      },
      refetchInterval: isCheckTransaction,
   });
};
