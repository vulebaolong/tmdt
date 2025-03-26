import { getProductListAction } from "@/actions/product.action";
import { resError } from "@/helpers/function.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProductList = () => {
   return useMutation({
      mutationFn: async (page: number) => {
         const products = await getProductListAction(page);
         if (!products.items) products.items = [];
         return products;
      },
      onError: (error) => {
         console.error("Error fetching product list:", error);
         toast.error(resError(error, `Register failed`));
      },
   });
};
