import NoImage from "@/components/no-image/NoImage";
import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { Box } from "@mantine/core";
import Image from "next/image";
import { useMemo, useState } from "react";

type TProductImageProps = {
   src?: string;
   preview?: string;
   width?: string;
   height?: string;
   isHero?: boolean;
   borderRadius?: string | number;
   onMouseEnter?: () => void
};

export default function ProductImage({ src, preview, width = "100%", height = "auto", isHero = false, borderRadius, onMouseEnter }: TProductImageProps) {
   const [error, setError] = useState(false);

   const imageUrl = useMemo(() => {
      if (preview) return preview;
      if (src) return `${BASE_DOMAIN_CLOUDINARY}${src}`;
      return "";
   }, [src, preview]);

   return !error && imageUrl ? (
      <Box style={{ aspectRatio: "1 / 1", width, height }} onMouseEnter={onMouseEnter}>
         <Image
            src={imageUrl}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius }}
            alt="product-image"
            priority={isHero}
            onError={() => setError(true)}
         />
      </Box>
   ) : (
      <Box style={{ aspectRatio: "1 / 1", width, height }}>
         <NoImage />
      </Box>
   );
}
