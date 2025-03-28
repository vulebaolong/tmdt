import { useEffect, useMemo } from "react";

export function useImagePreview(file: File | null | undefined) {
   const url = useMemo(() => {
      if (file instanceof File) {
         return URL.createObjectURL(file);
      }
      return "";
   }, [file]);

   useEffect(() => {
      return () => {
         if (url) URL.revokeObjectURL(url);
      };
   }, [url]);

   return url;
}
