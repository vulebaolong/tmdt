import { uploadLogoAction } from "@/actions/setting.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { useMutation } from "@tanstack/react-query";

export const useUploadLogo = () => {
   const toast = useAppToast();
   return useMutation({
      mutationFn: async (file: File) => {
         return await uploadLogoAction(file);
      },
      onSuccess: () => {
         toast.success("Upload logo successfully");
      },
      onError: () => {
         toast.error("Upload logo failed");
      },
   });
};
