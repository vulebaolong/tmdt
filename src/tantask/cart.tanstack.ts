import { addToCartAction, getCartCountAction, TAddToCartAction } from "@/actions/cart.action";
import { resError } from "@/helpers/function.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useCartCountQuery() {
   return useQuery({
      queryKey: ["cart-count"],
      queryFn: async () => {
         return await getCartCountAction();
      },
   });
}

export function useAddToCart() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TAddToCartAction) => {
         const data = await addToCartAction(payload);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`cart-count`] });
      },
      onError: (error) => {
         console.error("useAddToCart:", error);
         toast.error(resError(error, `Add To Cart failed`));
      },
   });
}
