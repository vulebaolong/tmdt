import { useQuery } from "@tanstack/react-query";
import { checkPendingOrderAction, deleteOrderAction, getOrderByIdAction } from "@/actions/order.action";
import { createOrderAction, TCreateOrder } from "@/actions/order.action";
import { resError } from "@/helpers/function.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ROUTER from "@/constant/router.constant";
import { useRouter } from "next/navigation";

export function useCreateOrder() {
   return useMutation({
      mutationFn: async (payload: TCreateOrder) => {
         return await createOrderAction(payload);
      },
      onSuccess: (res) => {
         if (res.success) {
            toast.success("Tạo đơn hàng thành công!");
         } else {
            toast.error("Tạo đơn hàng thất bại!");
         }
      },
      onError: (error) => {
         toast.error(resError(error, `Lỗi tạo đơn hàng!`));
      },
   });
}

export function useGetOrderById(id?: string) {
   const router = useRouter();

   return useQuery({
      queryKey: ["get-order-by-id", id],
      queryFn: async () => {
         if (!id) throw new Error("Missing order ID");
         const res = await getOrderByIdAction(id);
         if (!res.success) {
            router.push(ROUTER.CART);
            toast.error(`Đơn hàng đã hết hạn thanh toán`);
         }
         return res;
      },
      enabled: !!id,
   });
}

export function useDeleteOrder() {
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
         toast.error(resError(error, `Lỗi xoá đơn hàng!`));
      },
   });
}

export function useCheckPendingOrder() {
   return useMutation({
      mutationFn: () => checkPendingOrderAction(),
      onError: (error) => {
         toast.error(resError(error, `Lỗi kiểm tra đơn hàng!`));
      },
   })
}
