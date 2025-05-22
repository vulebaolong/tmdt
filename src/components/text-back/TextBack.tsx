"use client"

import { Text } from "@mantine/core";
import useRouter from "@/hooks/use-router-custom";

export default function TextBack() {
   const router = useRouter();

   return (
      <Text
         onClick={() => {
            router.back();
         }}
         style={{ textDecoration: `underline`, cursor: `pointer`, opacity: 0.5 }}
      >
         Quay lại
      </Text>
   );
}
