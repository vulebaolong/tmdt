"use client";

import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { Box, Group, Image, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import ProductTag from "../product-tag/ProductTag";
import classes from "./ProductItem.module.css";

type TProps = {
   product: IProduct;
};

function ProductItem({ product }: TProps) {
   const router = useRouter();

   return (
      <Box
         className={`${classes[`box-item`]}`}
         onClick={() => {
            router.push(`${ROUTER.PRODUCT}/${product._id}`);
         }}
      >
         <Image
            style={{ width: `100%`, objectFit: `contain` }}
            // src={`	https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lpu7emvja9zsb3_tn.webp`}
            src={product.images[0]}
            alt="image-product"
         />
         <Stack p={5}>
            <Text lineClamp={2}>{product.name}</Text>
            <Group>
               {product.tag.map((tag: number, i: number) => {
                  return <ProductTag tag={tag} key={i} />;
               })}
            </Group>
            <Group align="center" justify="space-between">
               <Text style={{ fontWeight: 900 }} fz={18} c={`shopee`}>
                  ₫{renderData(product.price)}
               </Text>
               <Text fz={14}>Đã bán {renderData(product.sold)}</Text>
            </Group>
         </Stack>
      </Box>
   );
}

export default ProductItem;
