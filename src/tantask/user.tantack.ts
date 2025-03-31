import { TUpdateProfile, updateProfileAction } from "@/actions/user.action";
import { resError } from "@/helpers/function.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";



export const useUpdateProfile = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: async (payload: TUpdateProfile) => {
         return await updateProfileAction(payload);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`query-info`] });
         toast.success(`Update Profile success`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update Profile failed`));
      },
   });
};
