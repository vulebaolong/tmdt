"use client";

import { Box, Image } from "@mantine/core";
import { useRouter } from "next/navigation";

type TProps = {
   width?: string;
};

export function LogoIcon({ width = `40px` }: TProps) {
   const router = useRouter();

   const handleClickLogo = () => {
      router.push("/");
   };

   return (
      <Box onClick={handleClickLogo} style={{ cursor: `pointer` }}>
         <Image style={{ width: width }} src={`/logo/logo-icon.png`} alt="logo" />
      </Box>
   );
}
