"use client";

import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { Box, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import ProductImage from "../product-image/ProductImage";
import ProductTag from "../product-tag/ProductTag";
import classes from "./ProductItem.module.css";
import { useTranslations } from "next-intl";

type TProps = {
   product: IProduct;
   preview?: string;
   type?: `show` | `review`;
};

function ProductItem({ product, type = `show`, preview }: TProps) {
   const router = useRouter();
   const t = useTranslations()

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
      if (type === "show") router.push(`${ROUTER.PRODUCT}/${product._id}`);
   };

   return (
      <Box style={{ cursor: type === `show` ? `pointer` : `default` }} className={`${classes[`box-item`]}`} onClick={handleClick}>
         <ProductImage src={product.imagePublicId} preview={preview} />
         <Stack p={5}>
            <Box h={30}>
               <Text fz={12} lineClamp={2} opacity={!product.name ? 0.7 : 1}>
                  {getDisplayName()}
               </Text>
            </Box>

            <Group wrap="nowrap">
               {product.tags.length === 0 && (
                  <Text fz={8} opacity={0.7}>
                     Nhãn sản phẩm
                  </Text>
               )}
               {product.tags.map((tag: number, i: number) => {
                  return <ProductTag tag={tag} key={i} />;
               })}
            </Group>
            <Group align="center" justify="space-between">
               <Text truncate style={{ fontWeight: 900 }} fz={14} c={`shopee`}>
                  ₫{renderData(product.price)}
               </Text>
               <Text fz={14}>{t(`Sold`)} {renderData(product.sold)}</Text>
            </Group>
         </Stack>
      </Box>
   );
}

export default ProductItem;
