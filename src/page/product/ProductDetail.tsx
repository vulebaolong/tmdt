"use client";

import ModalAddReceivingInformation from "@/components/modal/add-receiving-information/ModalAddReceivingInformation";
import ProductImage from "@/components/product/product-image/ProductImage";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { createQRMomopay, createQRZalopay, createVietQR } from "@/helpers/qr-payment.helper";
import { useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/schemas/product.schema";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";
import { ActionIcon, Box, Button, Center, Container, Divider, Group, NumberInput, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconMapPinFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import classes from "./ProductDetail.module.css";

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
   const [opened, handleModalAdd] = useDisclosure(false);

   const { data } = useCheckTransaction();

   useEffect(() => {
      if (data?.hasNew) {
         toast.success("💰 Giao dịch mới vừa được ghi nhận!", { autoClose: false });
      }
   }, [data?.hasNew]);

   const total = useMemo(() => {
      const productTotal = product.price * quantity;
      const shippingFee = product.shippingFee;
      const totalPayment = productTotal + shippingFee;
      return {
         productTotal,
         shippingFee,
         totalPayment,
      };
   }, [product.price, quantity, product.shippingFee]);

   const handleOrder = async () => {
      if (!info?._id) return toast.warning(`Bạn cần đăng nhập để mua hàng`);

      const vietQR = await createVietQR(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);
      const qrMomo = await createQRMomopay(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);
      const qrZalopay = await createQRZalopay(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);

      setVietQr(vietQR);
      setQrMomo(qrMomo);
      setQrZalopay(qrZalopay);
   };

   return (
      <>
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

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
                  <Stack style={{ filter: `blur(${!info?.address || !info?.phone ? `2px` : `0px`})` }}>
                     <Group gap={5}>
                        <IconMapPinFilled color={theme.colors.shopee[5]} />
                        <Text style={{ color: theme.colors.shopee[5], fontSize: 22, fontWeight: 800 }}>Địa Chỉ Nhận Hàng</Text>
                     </Group>
                     <Stack gap={0}>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.7 }}>Tên nhận hàng: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.fullName}</Text>
                        </Group>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.7 }}>Số điện thoại: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.phone || `--`}</Text>
                        </Group>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.7 }}>Địa chỉ: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.address || `--`}</Text>
                        </Group>
                     </Stack>
                  </Stack>
                  {(!info?.address || !info?.phone) && (
                     <Center className={`${classes[`box-3`]}`}>
                        <Button onClick={handleModalAdd.open} w={300}>Cập nhật thông tin nhận hàng</Button>
                     </Center>
                  )}
               </Paper>

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
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
                           <Text style={{ fontWeight: 900 }}>₫{renderData(product.shippingFee)}</Text>
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
               </Paper>

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
         <ModalAddReceivingInformation opened={opened} close={handleModalAdd.close} />
      </>
   );
}
