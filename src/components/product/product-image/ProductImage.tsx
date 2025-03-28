import NoImage from "@/components/no-image/NoImage";
import { Box } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";

type TProductImageProps = {
   src?: string;
   width?: string;
   height?: string;
};

export default function ProductImage({ src, width = `100%`, height = `auto` }: TProductImageProps) {
   const [error, setError] = useState(false);
   const showImage = src && !error;

   return showImage ? (
      <Box style={{ aspectRatio: `1 / 1`, width, height }}>
         <Image
            src={src}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="product-image"
            onError={() => setError(true)}
         />
      </Box>
   ) : (
      <Box style={{ aspectRatio: `1 / 1`, width, height }}>
         <NoImage />
      </Box>
   );
}
