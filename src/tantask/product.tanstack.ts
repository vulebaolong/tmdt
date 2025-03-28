import {
   createProductAction,
   deleteProductAction,
   getProductListAction,
   getProductListAction2,
   TGetProducts,
   updateProductAction,
} from "@/actions/product.action";
import { resError } from "@/helpers/function.helper";
import { TCreateProductReq } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetProductList = () => {
   return useMutation({
      mutationFn: async (page: number) => {
         const products = await getProductListAction2(page);
         if (!products.items) products.items = [];
         return products;
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
         toast.success(`Create success`);
      },
      onError: (error) => {
         toast.error(resError(error, `Create failed`));
      },
   });
};

export const useUpdateProduct = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TCreateProductReq) => {
         console.log({ payload });
         const linkImage = await updateProductAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
         toast.success(`Update success`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update failed`));
      },
   });
};

export const useDeleteProduct = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (id: string) => {
         return await deleteProductAction(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
         toast.success(`Delete success`);
      },
      onError: (error) => {
         toast.error(resError(error, `Delete failed`));
      },
   });
};
