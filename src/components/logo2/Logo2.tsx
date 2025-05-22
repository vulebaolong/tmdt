"use client";

import { Box } from "@mantine/core";
import Image from "next/image";
import useRouter from "@/hooks/use-router-custom";

type TProps = {
   width?: number | string;
   height?: number | string;
};

export function Logo2({ width = 40, height = `auto` }: TProps) {
   const router = useRouter();

   const handleClickLogo = () => {
      router.push("/");
   };

   return (
      <Box onClick={handleClickLogo} style={{ cursor: `pointer` }}>
         <Box style={{ width, height }}>
            <Image
               src={`/logo/logo-nail.webp`}
               width={0}
               height={0}
               sizes="100vw"
               style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
               alt="product-image"
               priority={true}
            />
         </Box>
      </Box>
   );
}
