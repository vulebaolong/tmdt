"use client";

import ProductImage from "@/components/product/product-image/ProductImage";
import { SHIPPING_FEE } from "@/constant/app.constant";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { createQRMomopay, createQRZalopay, createVietQR } from "@/helpers/qr-payment.helper";
import { useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/schemas/product.schema";
import { ActionIcon, Box, Button, Center, Container, Divider, Group, NumberInput, Stack, Text, useMantineTheme } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconMapPinFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import classes from "./ProductDetail.module.css";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";

type TProps = {
   product: IProduct;
};

export default function ProductDetail({ product }: TProps) {
   const [quantity, { increment, decrement, set }] = useCounter(1, { min: 1 });
   const [vietQr, setVietQr] = useState<string | null>(null);
   const [qrMomo, setQrMomo] = useState<string | null>(null);
   const [qrZalopay, setQrZalopay] = useState<string | null>(null);
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();

   const { data } = useCheckTransaction();

   useEffect(() => {
      if (data?.hasNew) {
         toast.success("💰 Giao dịch mới vừa được ghi nhận!", { autoClose: false });
      }
   }, [data?.hasNew]);


   const total = useMemo(() => {
      const productTotal = product.price * quantity;
      const shippingFee = SHIPPING_FEE;
      const totalPayment = productTotal + shippingFee;
      return {
         productTotal,
         shippingFee,
         totalPayment,
      };
   }, [product.price, quantity]);

   const handleOrder = async () => {
      if (!info?._id) return toast.warning(`Bạn cần đăng nhập để mua hàng`);

      const vietQR = await createVietQR(total.totalPayment.toString(), `--${product._id}-${info._id}--`);
      const qrMomo = await createQRMomopay(total.totalPayment.toString(), `--${product._id}-${info._id}--`);
      const qrZalopay = await createQRZalopay(total.totalPayment.toString(), `--${product._id}-${info._id}--`);

      setVietQr(vietQR);
      setQrMomo(qrMomo);
      setQrZalopay(qrZalopay);
   };

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
                        <ProductImage src={product.imagePublicId} />
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
                        <Group gap={2}>
                           <ActionIcon variant="default" size="md" radius="md" onClick={decrement}>
                              <IconChevronDown color="var(--mantine-color-red-text)" />
                           </ActionIcon>
                           <NumberInput
                              onChange={(e) => {
                                 set(e as number);
                              }}
                              w={50}
                              value={quantity}
                              radius="md"
                              size="xs"
                              thousandSeparator=","
                              defaultValue={1_000_000}
                              hideControls
                           />
                           <ActionIcon variant="default" size="md" radius="md" onClick={increment}>
                              <IconChevronUp color="var(--mantine-color-teal-text)" />
                           </ActionIcon>
                        </Group>
                     </Stack>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Thành Tiền
                        </Text>
                        <Text style={{ fontWeight: 900 }}>₫{renderData(total.productTotal)}</Text>
                     </Stack>
                  </Box>

                  <Divider />

                  <Box className={`${classes[`box-2`]}`}>
                     <Text style={{ fontWeight: 900 }}>Phương thức vận chuyển</Text>
                     <Stack>
                        <Text style={{ fontSize: 14 }}>Giao hàng tận nơi</Text>
                        <Group gap={2}>
                           <Image
                              width={15}
                              height={15}
                              sizes="100vw"
                              alt="product-shipping"
                              src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/a714965e439d493ba00c.svg"
                           />
                           <Text h={15} style={{ color: `#26aa99`, fontSize: 12 }}>
                              Đảm bảo nhận hàng từ 28 Tháng 3 - 31 Tháng 3
                           </Text>
                        </Group>
                     </Stack>
                     <Stack>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Phí Vận Chuyển
                        </Text>
                        <Text style={{ fontWeight: 900 }}>₫{renderData(SHIPPING_FEE)}</Text>
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
                              ₫{renderData(total.productTotal)}
                           </Text>
                        </Group>
                        <Group align="baseline" justify="space-between">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Tổng tiền phí vận chuyển:
                           </Text>

                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              ₫{renderData(total.shippingFee)}
                           </Text>
                        </Group>
                        <Group align="baseline" justify="space-between">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Tổng thanh toán:
                           </Text>

                           <Text style={{ fontSize: 25, color: theme.colors.shopee[5], fontWeight: 900 }}>₫{renderData(total.totalPayment)}</Text>
                        </Group>
                     </Stack>
                  </Group>

                  <Divider />

                  <Group justify="end">
                     <Button onClick={handleOrder} size="lg" w={150} color={theme.colors.shopee[5]}>
                        Đặt Hàng
                     </Button>
                  </Group>
               </Stack>
            </Box>

            {vietQr && (
               <Center>
                  <Image src={vietQr} width={300} height={300} alt="product-image" />
               </Center>
            )}
            {qrMomo && (
               <Center>
                  <Image src={qrMomo} width={300} height={300} alt="product-image" />
               </Center>
            )}
            {qrZalopay && (
               <Center>
                  <Image src={qrZalopay} width={300} height={300} alt="product-image" />
               </Center>
            )}
         </Stack>
      </Container>
   );
}
