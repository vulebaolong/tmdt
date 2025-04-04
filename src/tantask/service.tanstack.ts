import { createServiceAction, deleteServiceAction, getServiceListAction, getServiceListAction2, TCreateServiceAction, TGetServices, TUpdateServiceAction, updateServiceAction } from "@/actions/service.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { resError } from "@/helpers/function.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useServices = (params: TGetServices) => {
   return useQuery({
      queryKey: ["services", params],
      queryFn: async () => {
         const products = await getServiceListAction(params);
         return products;
      },
   });
};


export type TGetServiceList = {
   page: number;
   category?: string;
};
export const useGetServiceList = () => {
   const toast = useAppToast();

   return useMutation({
      mutationFn: async (payload: TGetServiceList) => {
         const products = await getServiceListAction2(payload);
         if (!products.items) products.items = [];
         return products;
      },
      onError: (error) => {
         console.error("Error fetching product list:", error);
         toast.error(resError(error, `Get product list failed`));
      },
   });
};

export const useCreateService = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TCreateServiceAction) => {
         const linkImage = await createServiceAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`services`] });
         toast.success(`Create service successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Create service failed`));
      },
   });
};

export const useUpdateService = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TUpdateServiceAction) => {
         console.log({ payload });
         const linkImage = await updateServiceAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`services`] });
         toast.success(`Update service successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update service failed`));
      },
   });
};

export const useDeleteService = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (id: string) => {
         return await deleteServiceAction(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`services`] });
         toast.success(`Delete service successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Delete service failed`));
      },
   });
};