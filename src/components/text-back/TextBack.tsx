"use client"

import useRouter from "@/hooks/use-router-custom";
import Text from "../custom/text-custom/TextCustom";

export default function TextBack() {
   const router = useRouter();

   return (
      <Text
         onClick={() => {
            router.back();
         }}
         style={{ textDecoration: `underline`, cursor: `pointer`, opacity: 0.5 }}
      >
         Back
      </Text>
   );
}
