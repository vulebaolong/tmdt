"use client";

import { getSiteLogo } from "@/actions/setting.action";
import { Box } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TProps = {
   width?: number | string;
   height?: number | string;
};

export function LogoIcon({ width = 40, height = `auto` }: TProps) {
   const router = useRouter();
   const [logo, setLogo] = useState<string | null>(null);

   const handleClickLogo = () => {
      router.push("/");
   };

   useEffect(() => {
      (async () => {
         const logo = await getSiteLogo();
         setLogo(logo);
      })();
   }, []);

   return (
      <Box onClick={handleClickLogo} style={{ cursor: `pointer` }}>
         <Box style={{ aspectRatio: "1 / 1", width, height }}>
            {logo && (
               <Image
                  src={logo || `/logo/logo-icon.png`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  alt="product-image"
                  priority={true}
               />
            )}
         </Box>
      </Box>
   );
}
