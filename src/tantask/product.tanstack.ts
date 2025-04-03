import {
   createProductAction,
   deleteProductAction,
   getProductListAction,
   getProductListAction2,
   TCreateProductAction,
   TGetProducts,
   updateProductAction,
} from "@/actions/product.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { resError } from "@/helpers/function.helper";
import { TCreateProductReq } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TPayloadGetProductList = {
   page: number;
   category?: string;
   searchProduct?: string;
};

export const useGetProductList = () => {
   const toast = useAppToast();

   return useMutation({
      mutationFn: async (payload: TPayloadGetProductList) => {
         console.log({ payload });
         const products = await getProductListAction2(payload);
         if (!products.items) products.items = [];
         return products;
      },
      onError: (error) => {
         console.error("Error fetching product list:", error);
         toast.error(resError(error, `Get product list failed`));
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
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TCreateProductAction) => {
         const linkImage = await createProductAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
         toast.success(`Create product successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Create product failed`));
      },
   });
};

export const useUpdateProduct = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TCreateProductReq) => {
         console.log({ payload });
         const linkImage = await updateProductAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
         toast.success(`Update product successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update product failed`));
      },
   });
};

export const useDeleteProduct = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (id: string) => {
         return await deleteProductAction(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`products`] });
         toast.success(`Delete product successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Delete product failed`));
      },
   });
};
