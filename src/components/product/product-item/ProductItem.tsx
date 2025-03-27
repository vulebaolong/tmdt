"use client";

import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { Box, Group, Image, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import ProductTag from "../product-tag/ProductTag";
import classes from "./ProductItem.module.css";
import NoImage from "@/components/no-image/NoImage";

type TProps = {
   product: IProduct;
   type?: `show` | `review`;
};

function ProductItem({ product, type = `show` }: TProps) {
   const router = useRouter();

   console.log({ product });
   return (
      <Box
         style={{ cursor: type === `show` ? `pointer` : `default` }}
         className={`${classes[`box-item`]}`}
         onClick={() => {
            if (type === `show`) router.push(`${ROUTER.PRODUCT}/${product._id}`);
         }}
      >
         {product.images[0] ? (
            <Image
               style={{ width: `100%`, objectFit: `cover`, aspectRatio: `1 / 1` }}
               // src={`	https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lpu7emvja9zsb3_tn.webp`}
               src={product.images[0]}
               alt="image-product"
            />
         ) : (
            <Box w={215} h={215}>
               <NoImage />
            </Box>
         )}
         <Stack p={5}>
            <Box h={50}>
               {type === `review` ? (
                  <Text lineClamp={2}>
                     {product.name?.includes(" ")
                        ? product.name
                        : product.name.replace(/(.{10})/g, "$1 ") || <Text component="span"  opacity={0.7}>Tên Sản Phẩm</Text>}
                  </Text>
               ) : (
                  <Text lineClamp={2}>{product.name || `?????`}</Text>
               )}
            </Box>

            <Group>
               {product.tag.length === 0 && <Text fz={12}  opacity={0.7}>Nhãn sản phẩm</Text>}
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
