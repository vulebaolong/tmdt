import { createProductAction, getProductListAction, TGetProducts } from "@/actions/product.action";
import { resError } from "@/helpers/function.helper";
import { TCreateProductReq } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProductList = () => {
   return useMutation({
      mutationFn: async () => {
         // const products = await getProductListAction(page);
         // if (!products.items) products.items = [];
         return null;
      },
      onError: (error) => {
         console.error("Error fetching product list:", error);
         toast.error(resError(error, `Register failed`));
      },
   });
};

export const useProducts = (params: TGetProducts) => {
   return useQuery({
      queryKey: ["products", params],
      queryFn: async () => {
         const products = await getProductListAction(params);
         return products;
      },
   });
};

export const useCreateProduct = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TCreateProductReq) => {
         const linkImage = await createProductAction(payload);
         console.log({ linkImage });
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
      },
      onError: (error) => {
         toast.error(resError(error, `Upload image failed`));
      },
   });
};
