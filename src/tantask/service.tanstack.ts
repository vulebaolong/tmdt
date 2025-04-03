import { createServiceAction, deleteServiceAction, getServiceListAction, TCreateServiceAction, TGetServices, TUpdateServiceAction, updateServiceAction } from "@/actions/service.action";
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