import { createOrderAction, TCreateOrder } from "@/actions/order.action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useCreateOrder() {
   return useMutation({
      mutationFn: async (first: TCreateOrder) => { 
         return await createOrderAction(first)
       },
      onSuccess: (res) => {
         if (res.success) {
            toast.success("Tạo đơn hàng thành công!");
         } else {
            toast.error("Tạo đơn hàng thất bại!");
         }
      },
      onError: (err) => {
         console.log(err);
         toast.error("Lỗi tạo đơn hàng!");
      },
   });
}