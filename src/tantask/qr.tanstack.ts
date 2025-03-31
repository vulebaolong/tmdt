import { resError } from "@/helpers/function.helper";
import { createQRMomopay, createQRZalopay, createVietQR } from "@/helpers/qr-payment.helper";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateQrMomo = () => {
   return useMutation({
      mutationFn: async (payload: { amount: string; purpose: string }) => {
         const data = await createQRMomopay(payload.amount, payload.purpose);
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Create QR Momo failed`));
      },
   });
};
export const useCreateQrZalopay = () => {
   return useMutation({
      mutationFn: async (payload: { amount: string; purpose: string }) => {
         const data = await createQRZalopay(payload.amount, payload.purpose);
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Create QR ZaloPay failed`));
      },
   });
};
export const useCreateVietQR = () => {
   return useMutation({
      mutationFn: async (payload: { amount: string; purpose: string }) => {
         const data = await createVietQR(payload.amount, payload.purpose);
         return data;
      },
      onError: (error) => {
         console.log(error);
         toast.error(resError(error, `Create QR Viet failed`));
      },
   });
};
