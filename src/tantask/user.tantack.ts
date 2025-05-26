import { getUserListAction, TGetUsers, TUpdateProfile, TUpdateUserAction, updateProfileAction, updateUserAction } from "@/actions/user.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { resError } from "@/helpers/function.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useUsers = (params: TGetUsers) => {
   return useQuery({
      queryKey: ["users", params],
      queryFn: async () => {
         const users = await getUserListAction(params);
         return users;
      },
   });
};

export const useUpdateUser = () => {
   const toast = useAppToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (payload: TUpdateUserAction) => {
         console.log({ payload });
         const linkImage = await updateUserAction(payload);
         return linkImage;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [`users`] });
         toast.success(`Update user successfully`);
      },
      onError: (error) => {
         toast.error(resError(error, `Update user failed`));
      },
   });
};
