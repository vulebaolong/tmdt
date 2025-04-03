import { TUpdateProfile, updateProfileAction } from "@/actions/user.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { resError } from "@/helpers/function.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();
   
   return useMutation({
      mutationFn: async (payload: TUpdateProfile) => {
         return await updateProfileAction(payload);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`query-info`] });
         toast.success(`Update profile successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update profile failed`));
      },
   });
};
