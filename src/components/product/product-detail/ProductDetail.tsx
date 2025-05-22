"use client";

import NodataOverlay from "@/components/no-data/NodataOverlay";
import TextBack from "@/components/text-back/TextBack";
import TextContent from "@/components/text-content/TextContent";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { useAddToCart } from "@/tantask/cart.tanstack";
import { Box, Button, Container, Divider, Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import useRouter from "@/hooks/use-router-custom";
import ProductImage from "../product-image/ProductImage";
import classes from "./ProductDetail.module.css";

type TProps = {
   product: IProduct;
};

export default function ProductDetail({ product }: TProps) {
   const theme = useMantineTheme();
   const router = useRouter();

   const addToCart = useAddToCart();

   const handleAddToCart = () => {
      addToCart.mutate({ productId: product._id as string, quantity: 1 });
   };

   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Paper shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
               <Box className={`${classes[`box-1`]}`}>
                  <Box style={{ borderRadius: `10px`, overflow: `hidden`, height: `min-content` }}>
                     <ProductImage src={`${product.imagePublicId}`} />
                  </Box>

                  <Stack>
                     <Text fz={25} fw={900}>
                        {product.name}
                     </Text>
                     <Group>
                        <Group>
                           <Text opacity={0.5}>Thương hiệu</Text>
                           <Text c={theme.colors.shopee[5]}>{product.brand ? product.brand : `Đang cập nhật`}</Text>
                        </Group>

                        <Divider orientation="vertical" />

                        <Group>
                           <Text opacity={0.5}>Tình trạng</Text>
                           <Text c={theme.colors.shopee[5]}>{product.inStock ? `Còn hàng` : `Hết hàng`}</Text>
                        </Group>
                     </Group>
                     <Text c={theme.colors.shopee[5]} fz={25} fw={700}>
                        ₫{renderData(product.price)}
                     </Text>

                     <Divider />

                     <TextContent text={product.description} />

                     <Group>
                        <Button onClick={handleAddToCart} c={theme.colors.shopee[5]} size="xl" w={`min-content`} variant="outline">
                           Thêm vào giao hàng
                        </Button>
                        <Button
                           onClick={() => {
                              addToCart.mutate(
                                 { productId: product._id as string, quantity: 1 },
                                 {
                                    onSuccess: () => {
                                       router.push(ROUTER.CART);
                                    },
                                 }
                              );
                           }}
                           bg={theme.colors.shopee[5]}
                           size="xl"
                           w={`min-content`}
                        >
                           Mua ngay
                        </Button>
                     </Group>
                  </Stack>
               </Box>
            </Paper>

            <Paper shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }} pos={`relative`} mih={300}>
               <NodataOverlay visiable={!product.content} />
               <Stack>
                  <Box>
                     <Text fz={`h2`} fw={700}>
                        NỘI DUNG SẢN PHẨM
                     </Text>
                     {product.content && <div dangerouslySetInnerHTML={{ __html: product.content }} />}
                  </Box>
                  {/* <Box>
                     <Text fz={`h2`} fw={700}>
                        MÔ TẢ SẢN PHẨM
                     </Text>
                     <div dangerouslySetInnerHTML={{ __html: product.content }} />
                  </Box> */}
               </Stack>
            </Paper>

            {/* <Paper shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
               <Stack>
                  <Text fz={`h2`} fw={700}>
                     ĐÁNH GIÁ SẢN PHẨM
                  </Text>
                  <div dangerouslySetInnerHTML={{ __html: product.content }} />
               </Stack>
            </Paper> */}
         </Stack>
      </Container>
   );
}
