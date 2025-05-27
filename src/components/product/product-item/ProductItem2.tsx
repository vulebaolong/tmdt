"use client";

import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import NoImage from "@/components/no-image/NoImage";
import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import ROUTER_CLIENT from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import useRouter from "@/hooks/use-router-custom";
import { IProduct } from "@/schemas/product.schema";
import { Box, Center, Stack, Text } from "@mantine/core";

type TProps = {
   product: IProduct;
   preview?: string;
   type?: `show` | `review`;
};

export default function ProductItem2({ product, type = `show`, preview }: TProps) {
   const router = useRouter();

   const getDisplayName = () => {
      if (type === "review") {
         if (product.name) {
            if (product.name.includes(" ")) {
               return product.name;
            } else {
               return product.name.replace(/(.{10})/g, "$1 ");
            }
         }
         return "Tên Sản Phẩm";
      }

      return product.name || "?????";
   };

   const handleClick = () => {
      if (type === "show") router.push(`${ROUTER_CLIENT.PRODUCT}/${product._id}`);
   };

   return (
      <Stack
         sx={{
            height: "100%",
            background: `transparent`,
            alignItems: "center",
            cursor: "pointer",
         }}
         onClick={handleClick}
      >
         <Box
            sx={{
               background: `white`,
               borderRadius: `15px`,
               overflow: `hidden`,
               width: `100%`,
               height: `auto`,
               aspectRatio: `1 / 1`,
               "& img": {
                  transition: "transform 0.3s ease",
               },
               "&:hover img": {
                  transform: "scale(1.1)",
               },
            }}
         >
            {!preview && !product.imagePublicIds?.[0] ? (
               <NoImage />
            ) : (
               <ImageCustom src={preview ? preview : `${BASE_DOMAIN_CLOUDINARY}${product.imagePublicIds?.[0]}`} alt="" />
            )}
         </Box>
         <Box>
            <Center>
               <Text truncate="end" maw={200}>
                  {getDisplayName()}
               </Text>
            </Center>
            <Center>
               <Text truncate="end" maw={200}>
                  {product.brand}
               </Text>
            </Center>
         </Box>
         <Center>
            <Text
               truncate="end"
               maw={200}
               sx={(theme) => {
                  return { fontWeight: 700, color: theme.colors.spaTheme[5] };
               }}
            >
               ₫{renderData(product.price)}
            </Text>
         </Center>
      </Stack>
   );
}
