"use client";

import ModalAddReceivingInformation from "@/components/modal/add-receiving-information/ModalAddReceivingInformation";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/hooks";
import { TItem, useGetCartList } from "@/tantask/cart.tanstack";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";
import { useCreateOrder } from "@/tantask/order.tanstack";
import { useCreateQrMomo, useCreateQrZalopay, useCreateVietQR } from "@/tantask/qr.tanstack";
import { ETypePayment } from "@/types/enum/payment.enum";
import {
   ActionIcon,
   Box,
   Button,
   Center,
   Collapse,
   Container,
   Divider,
   Group,
   LoadingOverlay,
   Paper,
   Stack,
   Text,
   Transition,
   useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconBuildingBank, IconEdit, IconMapPinFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductListCart from "./product-list-cart/ProductListCart";
import classes from "./ProductCart.module.css";

export type TTotalPrice = { totalPriceItemCart: number; totalShipItemCart: number; totalPriceCart: number };

export default function ProductCart() {
   const [vietQr, setVietQr] = useState<string | null>(null);
   const [qrMomo, setQrMomo] = useState<string | null>(null);
   const [qrZalopay, setQrZalopay] = useState<string | null>(null);
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   const [openedModalAdd, handleModalAdd] = useDisclosure(false);
   const [openedQr, handleQr] = useDisclosure(false);
   const [typePayment, setTypePayment] = useState(ETypePayment[`Momo`]);
   const [totalPrice, setTotalPrice] = useState<TTotalPrice>({ totalPriceItemCart: 0, totalShipItemCart: 0, totalPriceCart: 0 });

   const { data } = useCheckTransaction();
   const createQrMomo = useCreateQrMomo();
   const createQrZalopay = useCreateQrZalopay();
   const createVietQR = useCreateVietQR();
   const [pagination] = useState({ pageIndex: 0, pageSize: 10 });

   const getCartList = useGetCartList(pagination);
   const createOrder = useCreateOrder();

   useEffect(() => {
      if (!info?._id) return;

      if (typePayment === ETypePayment[`Momo`]) {
         if (qrMomo) return;
         createQrMomo.mutate(
            { amount: totalPrice.totalPriceCart.toString(), purpose: `tmdtID_HOADON-${info._id}-` },
            {
               onSuccess: (data) => {
                  setQrMomo(data);
               },
            }
         );
      }
      if (typePayment === ETypePayment[`ZaloPay`]) {
         if (qrZalopay) return;
         createQrZalopay.mutate(
            { amount: totalPrice.totalPriceCart.toString(), purpose: `tmdtID_HOADON-${info._id}-` },
            {
               onSuccess: (data) => {
                  setQrZalopay(data);
               },
            }
         );
      }
      if (typePayment === ETypePayment[`Bank`]) {
         if (vietQr) return;
         createVietQR.mutate(
            { amount: totalPrice.totalPriceCart.toString(), purpose: `tmdtID_HOADON-${info._id}-` },
            {
               onSuccess: (data) => {
                  setVietQr(data);
               },
            }
         );
      }
   }, [typePayment, info?._id]);

   useEffect(() => {
      if (data?.hasNew) {
         toast.success("💰 Giao dịch mới vừa được ghi nhận!", { autoClose: false });
      }
   }, [data?.hasNew]);

   const handleOrder = async () => {
      if (!getCartList.data?.items) return;
      console.log({ getCartList: getCartList.data.items });
      createOrder.mutate({
         products: getCartList.data.items.map((item: TItem) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
            shippingFee: item.productId.shippingFee,
         })),
         totalPrice: totalPrice.totalPriceCart,
         paymentMethod: "momo",
      });

      // handleQr.open();
      // if (!info?._id) return toast.warning(`Bạn cần đăng nhập để mua hàng`);

      // const vietQR = await createVietQR(total.totalPayment.toString(), `tmdtID_HOADON-${info._id}-`);
      // const qrMomo = await createQRMomopay(total.totalPayment.toString(), `tmdtID_HOADON-${info._id}-`);
      // const qrZalopay = await createQRZalopay(total.totalPayment.toString(), `tmdtID_HOADON-${info._id}-`);

      // setVietQr(vietQR);
      // setQrMomo(qrMomo);
      // setQrZalopay(qrZalopay);
   };

   return (
      <>
         <Container pt={50} pb={100}>
            <Stack>
               <Text
                  onClick={() => {
                     router.push(ROUTER.PRODUCT);
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
                        <ActionIcon onClick={handleModalAdd.open} variant="transparent">
                           <IconEdit color={theme.colors.shopee[5]} />
                        </ActionIcon>
                     </Group>
                     <Stack gap={0}>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.5 }}>Tên nhận hàng: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.fullName}</Text>
                        </Group>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.5 }}>Số điện thoại: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.phone || `--`}</Text>
                        </Group>
                        <Group align="baseline">
                           <Text style={{ fontSize: 15, fontWeight: 5900, opacity: 0.5 }}>Địa chỉ: </Text>
                           <Text style={{ fontSize: 20, fontWeight: 900 }}>{info?.address || `--`}</Text>
                        </Group>
                     </Stack>
                  </Stack>
                  {(!info?.address || !info?.phone) && (
                     <Center className={`${classes[`box-3`]}`}>
                        <Button onClick={handleModalAdd.open} w={300}>
                           Cập nhật thông tin nhận hàng
                        </Button>
                     </Center>
                  )}
               </Paper>

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
                  <Stack>
                     <ProductListCart cartList={getCartList} setTotalPrice={setTotalPrice} />

                     <Group justify="end">
                        <Stack maw={360} w={`100%`}>
                           <Group align="baseline" justify="space-between">
                              <Text style={{ fontSize: 14 }} opacity={0.5}>
                                 Tổng tiền hàng:
                              </Text>

                              <Text style={{ fontSize: 14 }} opacity={0.5}>
                                 ₫{renderData(totalPrice.totalPriceItemCart)}
                              </Text>
                           </Group>
                           <Group align="baseline" justify="space-between">
                              <Text style={{ fontSize: 14 }} opacity={0.5}>
                                 Tổng tiền phí vận chuyển:
                              </Text>

                              <Text style={{ fontSize: 14 }} opacity={0.5}>
                                 ₫{renderData(totalPrice.totalShipItemCart)}
                              </Text>
                           </Group>
                           <Group align="baseline" justify="space-between">
                              <Text style={{ fontSize: 14 }} opacity={0.5}>
                                 Tổng thanh toán:
                              </Text>

                              <Text style={{ fontSize: 25, color: theme.colors.shopee[5], fontWeight: 900 }}>
                                 ₫{renderData(totalPrice.totalPriceCart)}
                              </Text>
                           </Group>
                        </Stack>
                     </Group>

                     <Divider />

                     <Group justify="end">
                        <Button
                           disabled={openedQr || !info?.address || !info?.phone || !getCartList.data?.items.length || getCartList.isError}
                           onClick={handleOrder}
                           size="lg"
                           w={150}
                           color={theme.colors.shopee[5]}
                        >
                           Đặt Hàng
                        </Button>
                     </Group>

                     {openedQr && (
                        <Center>
                           <Group gap={2}>
                              <IconAlertCircle opacity={0.5} size={20} />
                              <Text ta={`center`} style={{ opacity: 0.5 }}>
                                 Để chỉnh sửa thông tin đặt hàng vui lòng đóng cổng thanh toán
                              </Text>
                           </Group>
                        </Center>
                     )}
                  </Stack>
               </Paper>

               <Collapse in={openedQr}>
                  <Paper shadow="md" radius="lg" withBorder p="xl">
                     <Stack>
                        <Center>
                           <Text style={{ color: theme.colors.shopee[5], fontSize: 22, fontWeight: 800 }}>Cổng Thanh Toán</Text>
                        </Center>

                        <Center>
                           <Group>
                              <Button
                                 onClick={() => setTypePayment(ETypePayment[`Momo`])}
                                 variant={typePayment === ETypePayment[`Momo`] ? `outline` : `default`}
                                 h={100}
                                 w={150}
                              >
                                 <Stack gap={2} align="center">
                                    <Image src={`/logo-payment/momo.svg`} width={50} height={50} alt="product-image" />
                                    <Text>{ETypePayment[0]}</Text>
                                 </Stack>
                              </Button>
                              <Button
                                 onClick={() => setTypePayment(ETypePayment[`ZaloPay`])}
                                 variant={typePayment === ETypePayment[`ZaloPay`] ? `outline` : `default`}
                                 h={100}
                                 w={150}
                              >
                                 <Stack gap={2} align="center">
                                    <Image src={`/logo-payment/zalopay.webp`} width={50} height={50} alt="product-image" />
                                    <Text>{ETypePayment[1]}</Text>
                                 </Stack>
                              </Button>
                              <Button
                                 onClick={() => setTypePayment(ETypePayment[`Bank`])}
                                 variant={typePayment === ETypePayment[`Bank`] ? `outline` : `default`}
                                 h={100}
                                 w={150}
                              >
                                 <Stack gap={2} align="center">
                                    <IconBuildingBank size={50} />
                                    <Text>{ETypePayment[2]}</Text>
                                 </Stack>
                              </Button>
                           </Group>
                        </Center>

                        <Box h={326}>
                           <Transition
                              enterDelay={400}
                              mounted={typePayment === ETypePayment[`Momo`]}
                              transition="slide-right"
                              duration={400}
                              timingFunction="ease"
                           >
                              {(styles) => (
                                 <div style={{ ...styles }}>
                                    <Center>
                                       <Paper shadow="sm" radius={25} withBorder p="sm" w={`min-content`}>
                                          <Box style={{ width: 300, height: 300, borderRadius: `20px`, overflow: `hidden`, position: `relative` }}>
                                             <LoadingOverlay
                                                visible={createQrMomo.isPending}
                                                zIndex={1000}
                                                overlayProps={{ radius: "sm", bg: `transparent` }}
                                             />
                                             {qrMomo && (
                                                <Image
                                                   src={qrMomo}
                                                   width={0}
                                                   height={0}
                                                   style={{ display: "block", width: `100%`, height: `100%` }}
                                                   alt="qr-image"
                                                />
                                             )}
                                          </Box>
                                       </Paper>
                                    </Center>
                                 </div>
                              )}
                           </Transition>

                           <Transition
                              enterDelay={400}
                              mounted={typePayment === ETypePayment[`ZaloPay`]}
                              transition="slide-right"
                              duration={400}
                              timingFunction="ease"
                           >
                              {(styles) => (
                                 <div style={styles}>
                                    <Center>
                                       <Paper shadow="sm" radius={25} withBorder p="sm">
                                          <Box style={{ width: 300, height: 300, borderRadius: `20px`, overflow: `hidden`, position: `relative` }}>
                                             <LoadingOverlay
                                                visible={createQrZalopay.isPending}
                                                zIndex={1000}
                                                overlayProps={{ radius: "sm", bg: `transparent` }}
                                             />
                                             {qrZalopay && (
                                                <Image
                                                   src={qrZalopay}
                                                   width={0}
                                                   height={0}
                                                   style={{ display: "block", width: `100%`, height: `100%` }}
                                                   alt="qr-image"
                                                />
                                             )}
                                          </Box>
                                       </Paper>
                                    </Center>
                                 </div>
                              )}
                           </Transition>

                           <Transition
                              enterDelay={400}
                              mounted={typePayment === ETypePayment[`Bank`]}
                              transition="slide-right"
                              duration={400}
                              timingFunction="ease"
                           >
                              {(styles) => (
                                 <div style={styles}>
                                    <Center>
                                       <Paper shadow="sm" radius={25} withBorder p="sm">
                                          <Box style={{ width: 300, height: 300, borderRadius: `20px`, overflow: `hidden`, position: `relative` }}>
                                             <LoadingOverlay
                                                visible={createVietQR.isPending}
                                                zIndex={1000}
                                                overlayProps={{ radius: "sm", bg: `transparent` }}
                                             />
                                             {vietQr && (
                                                <Image
                                                   src={vietQr}
                                                   width={0}
                                                   height={0}
                                                   style={{ display: "block", width: `100%`, height: `100%` }}
                                                   alt="qr-image"
                                                />
                                             )}
                                          </Box>
                                       </Paper>
                                    </Center>
                                 </div>
                              )}
                           </Transition>
                        </Box>

                        <Center>
                           <Box>
                              <Text ta={`center`} maw={300} style={{ opacity: 0.5 }}>
                                 Bạn quét mã QR và thanh toán với phương thức mà bạn đã chọn nhé.
                              </Text>
                              <Text ta={`center`} maw={300} style={{ opacity: 0.5 }}>
                                 Hệ thống sẽ tự động ghi nhận sau khi bạn thanh toán thành công
                              </Text>
                           </Box>
                        </Center>

                        <Center>
                           <Button onClick={handleQr.close} variant="outline">
                              Đóng
                           </Button>
                        </Center>
                     </Stack>
                  </Paper>
               </Collapse>
            </Stack>
         </Container>
         <ModalAddReceivingInformation opened={openedModalAdd} close={handleModalAdd.close} />
      </>
   );
}
