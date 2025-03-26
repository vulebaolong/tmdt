"use client";

import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/schemas/product.schema";
import { Box, Button, Container, Divider, Group, Image, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconMapPinFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./Product.module.css";

type TProps = {
   product: IProduct;
};

export default function Product({ product }: TProps) {
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   return (
      <Container pt={50} pb={100}>
         <Stack>
            <Text
               onClick={() => {
                  router.push(ROUTER.HOME);
               }}
               style={{ textDecoration: `underline`, cursor: `pointer`, opacity: 0.5 }}
            >
               Quay lại
            </Text>

            <Box style={{ boxShadow: ` rgba(149, 157, 165, 0.2) 0px 8px 24px`, padding: `50px 20px` }}>
               <Stack>
                  <Group gap={5}>
                     <IconMapPinFilled color={theme.colors.shopee[5]} />
                     <Text style={{ color: theme.colors.shopee[5], fontSize: 22, fontWeight: 800 }}>Địa Chỉ Nhận Hàng</Text>
                  </Group>
                  <Group className={`${classes[`box-1`]}`} align="start">
                     <Stack gap={0}>
                        <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.fullName}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 900 }}>0836789578</Text>
                     </Stack>
                     <Text style={{ fontSize: 20 }}>
                        Số 109, Nguyễn Cơ Thạch, Khu Sala, toà nhà Nhật Nam, Phường An Lợi Đông, Thành Phố Thủ Đức, TP. Hồ Chí Minh
                     </Text>
                  </Group>
               </Stack>
            </Box>

            <Box style={{ boxShadow: ` rgba(149, 157, 165, 0.2) 0px 8px 24px`, padding: `20px 20px` }}>
               <Stack>
                  <Box>
                     <Text style={{ fontSize: 20, fontWeight: 900 }}>Sản Phẩm</Text>
                     <Box w={100}>
                        <Image
                           style={{ width: `100%`, objectFit: `contain` }}
                           // src={`	https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lpu7emvja9zsb3_tn.webp`}
                           src={product.images[0]}
                           alt="image-product"
                        />
                     </Box>
                  </Box>

                  <Divider />

                  <Box>
                     <Text style={{ fontSize: 14 }}>Tên</Text>
                     <Text>{product.name}</Text>
                  </Box>

                  <Divider />

                  <Box className={`${classes[`box-2`]}`}>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Đơn Giá
                        </Text>
                        <Text>₫{renderData(product.price)}</Text>
                     </Stack>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Số Lượng
                        </Text>
                        <Text>1</Text>
                     </Stack>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Thành Tiền
                        </Text>
                        <Text style={{ fontWeight: 900 }}>₫{renderData(product.price)}</Text>
                     </Stack>
                  </Box>

                  <Divider />

                  <Box className={`${classes[`box-2`]}`}>
                     <Text style={{ fontWeight: 900 }}>Phương thức vận chuyển</Text>
                     <Stack>
                        <Text style={{ fontSize: 14 }}>Giao hàng tận nơi</Text>
                        <Group gap={2}>
                           <Image
                              style={{ width: `15px`, height: `15px` }}
                              src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/a714965e439d493ba00c.svg"
                              alt="image-express"
                           />
                           <Text style={{ color: `#26aa99`, fontSize: 12 }}>Đảm bảo nhận hàng từ 28 Tháng 3 - 31 Tháng 3</Text>
                        </Group>
                     </Stack>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Phí Vận Chuyển
                        </Text>
                        <Text style={{ fontWeight: 900 }}>₫{renderData(product.price)}</Text>
                     </Stack>
                  </Box>

                  <Divider />

                  <Group justify="end">
                     <Stack maw={360} w={`100%`}>
                        <Group align="baseline" justify="space-between">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Tổng tiền hàng:
                           </Text>

                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              ₫{renderData(product.price)}
                           </Text>
                        </Group>
                        <Group align="baseline" justify="space-between">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Tổng tiền phí vận chuyển:
                           </Text>

                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              ₫{renderData(product.price)}
                           </Text>
                        </Group>
                        <Group align="baseline" justify="space-between">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Tổng thanh toán:
                           </Text>

                           <Text style={{ fontSize: 25, color: theme.colors.shopee[5], fontWeight: 900 }}>₫{renderData(product.price)}</Text>
                        </Group>
                     </Stack>
                  </Group>

                  <Divider />

                  <Group justify="end">
                     <Button size="lg" w={120} color={theme.colors.shopee[5]}>
                        Đặt Hàng
                     </Button>
                  </Group>
               </Stack>
            </Box>
         </Stack>
      </Container>
   );
}
