import {
   disableSecrectAction,
   generateGaAction,
   getInfoAction,
   loginFormAction,
   loginGoogleAuthenticatorAction,
   loginGooleAction,
   registerAction,
   saveSecrectAction,
   verifyGAAction,
} from "@/actions/auth.action";
import { waitForCheckGA } from "@/components/provider/check-ga/CheckGAProvider";
import { resError } from "@/helpers/function.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppDispatch } from "@/redux/hooks";
import { SET_INFO } from "@/redux/slices/user.slice";
import { TLoginFormReq, TPayloadLoginGoogleAuthenticator, TPayloadSaveSecret, TRegisterReq, TVerifyGAReq } from "@/types/auth.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetInfoMutation = () => {
   const dispatch = useAppDispatch();
   const router = useRouter();
   return useMutation({
      mutationFn: async () => {
         try {
            const data = await getInfoAction();
            console.log({ useGetInfoMutation: data });
            dispatch(SET_INFO(data));
            return true;
         } catch (error) {
            console.log(error);
            router.push("/login");
            return false;
         }
      },
   });
};

export const useGetInfoQuery = () => {
   const dispatch = useAppDispatch();

   return useQuery({
      queryKey: ["query-info"],
      queryFn: async () => {
         try {
            const data = await getInfoAction();
            if (!data) return null;
            console.log({ useGetInfoQuery: data });
            dispatch(SET_INFO(data));
            return data;
         } catch (error) {
            console.log(error);
            return null;
         }
      },
   });
};

export const useRegister = () => {
   return useMutation({
      mutationFn: async (payload: TRegisterReq) => {
         const data = await registerAction(payload);
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Register failed`));
      },
   });
};

export const useLoginForm = () => {
   return useMutation({
      mutationFn: async (payload: TLoginFormReq) => {
         const data = await loginFormAction(payload);
         // await getInfo.mutateAsync();
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Login failed`));
      },
   });
};

export const useLoginGoogleAuthenticator = () => {
   return useMutation({
      mutationFn: async (payload: TPayloadLoginGoogleAuthenticator) => {
         await loginGoogleAuthenticatorAction(payload);
         return `data`;
      },
      onError: (error) => {
         console.log(error);
         toast.error(`Login Google Authenticator failed`);
      },
   });
};

// export const useLoginFacebook = () => {
//    return useMutation({
//       mutationFn: async (payload: TLoginFacebookReq) => {
//          const data = await loginFacebookction(payload);
//          return data;
//       },
//       onError: (error) => {
//          console.log(error);
//          toast.error(resError(error, `Login failed`));
//       },
//    });
// };

export const useLoginGoolge = () => {
   return useMutation({
      mutationFn: async (payload: { code: string }) => {
         const data = await loginGooleAction(payload);
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Login failed`));
      },
   });
};

export const useGenerateGa = () => {
   return useMutation({
      mutationFn: async () => {
         const data = await generateGaAction();
         return data;
      },
   });
};

export const useSaveSecrect = () => {
   return useMutation({
      mutationFn: async (payload: TPayloadSaveSecret) => {
         const data = await saveSecrectAction(payload);
         return data;
      },
   });
};

export const useDisableSecrect = () => {
   const dispatch = useAppDispatch();

   return useMutation({
      mutationFn: async () => {
         const token = await waitForCheckGA(dispatch);
         const data = await disableSecrectAction(token);
         return data;
      },
   });
};

export const useVerifyGA = () => {
   return useMutation({
      mutationFn: async (payload: TVerifyGAReq) => {
         const data = await verifyGAAction(payload);
         return data;
      },
      onError: (error) => {
         toast.error(resError(error, `Verify Code Error`));
      },
   });
};
