import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_TIME_LEFT } from "@/redux/slices/transaction.slice";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

export function useCountdown(expiresAt?: string | Date, onSuccess?: () => void) {
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const dispatch = useAppDispatch();

   const stopCountdown = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
   };

   useEffect(() => {
      if (!expiresAt) return;

      const endTime = dayjs(expiresAt).valueOf();

      const updateCountdown = () => {
         const now = dayjs().valueOf();
         const diff = Math.max(0, Math.floor((endTime - now) / 1000));

         dispatch(SET_TIME_LEFT(diff));

         if (diff <= 0) {
            stopCountdown();
            if (onSuccess) onSuccess();
         }
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
         stopCountdown();
      };
   }, [expiresAt]);

   return {
      timeLeft: useAppSelector((state) => state.transaction.timeLeft),
      stopCountdown,
   };
}

