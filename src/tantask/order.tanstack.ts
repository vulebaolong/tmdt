import { useQuery } from "@tanstack/react-query";
import { checkPendingOrderAction, deleteOrderAction, getOrderByIdAction } from "@/actions/order.action";
import { createOrderAction, TCreateOrder } from "@/actions/order.action";
import { resError } from "@/helpers/function.helper";
import { useMutation } from "@tanstack/react-query";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { waitForCheckGA } from "@/components/provider/check-ga/CheckGAProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";

export function useCreateOrder() {
   const dispatch = useAppDispatch();
   const info = useAppSelector((state) => state.user.info);

   return useMutation({
      mutationFn: async (payload: TCreateOrder) => {
         const { token } = info?.googleAuthenticator ? await waitForCheckGA(dispatch) : undefined;
         return await createOrderAction({ ...payload, token });
      },
      onSuccess: (res) => {
         if (res.success) {
            toast.success("Create order successfully");
         } else {
            toast.error("Create order failed");
         }
      },
      onError: (error) => {
         toast.error(resError(error, `Create order error`));
      },
   });
}

export function useGetOrderById(id?: string) {
   const toast = useAppToast();
   const router = useRouter();

   return useQuery({
      queryKey: ["get-order-by-id", id],
      queryFn: async () => {
         if (!id) throw new Error("Missing order ID");
         const res = await getOrderByIdAction(id);
         if (!res.success) {
            router.push(ROUTER_CLIENT.CART);
            toast.error(`Order has expired payment`);
         }
         return res;
      },
      enabled: !!id,
   });
}

export function useDeleteOrder() {
   const toast = useAppToast();
   return useMutation({
      mutationFn: (id: string) => deleteOrderAction(id),
      onSuccess: (res) => {
         if (res.success) {
            toast.success(res.message);
         } else {
            toast.error(res.message);
         }
      },
      onError: (error) => {
         toast.error(resError(error, `Error deleting order`));
      },
   });
}

export function useCheckPendingOrder() {
   const toast = useAppToast();
   return useMutation({
      mutationFn: () => checkPendingOrderAction(),
      onError: (error) => {
         toast.error(resError(error, `Order Check Error`));
      },
   });
}
