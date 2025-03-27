import { uploadImage } from "@/actions/upload-image.action";
import { resError } from "@/helpers/function.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUploadImage = () => {
   return useMutation({
      mutationFn: async (formData: FormData) => {
         const linkImage = await uploadImage(formData);
         console.log({ linkImage });
         return linkImage;
      },
      onError: (error) => {
         toast.error(resError(error, `Upload image failed`));
      },
   });
};
