"use client";

import ModalConfirmAction from "@/components/modal/confirm-action/ModalConfirmAction";
import NodataOverlay from "@/components/no-data/NodataOverlay";
import TextBack from "@/components/text-back/TextBack";
import ROUTER_CLIENT from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { useCountdown } from "@/hooks/count-down.hook";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_IS_CHECK_TRANSACTION } from "@/redux/slices/transaction.slice";
import { useDeleteOrder, useGetOrderById } from "@/tantask/order.tanstack";
import { useCreateQrMomo, useCreateQrZalopay, useCreateVietQR } from "@/tantask/qr.tanstack";
import { EOrderPaymentMethod, EOrderStatus } from "@/types/enum/order.enum";
import { Box, Button, Center, Collapse, Container, Divider, Group, LoadingOverlay, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import useRouter from "@/hooks/use-router-custom";
import { useEffect, useState } from "react";

type TProps = {
   id: string;
};

export default function OrderDetail({ id }: TProps) {
   const router = useRouter();
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const dispatch = useAppDispatch();
   const [openedQr, handleOpenQr] = useDisclosure(false);
   const timeLeft = useAppSelector((state) => state.transaction.timeLeft);
   const [openedConfirmAction, handleConfirmAction] = useDisclosure(false);

   const [qr, setQr] = useState<string | null>(null);
   const createQrMomo = useCreateQrMomo();
   const createQrZalopay = useCreateQrZalopay();
   const createVietQR = useCreateVietQR();

   const getOrderById = useGetOrderById(id);

   const { stopCountdown } = useCountdown(getOrderById.data?.data?.expiresAt, () => {
      dispatch(SET_IS_CHECK_TRANSACTION(false));
      handleOpenQr.close();
   });

   useEffect(() => {
      if (timeLeft > 0) {
         handleOpenQr.open();
      } else {
         handleOpenQr.close();
      }
      if (timeLeft === -2) {
         stopCountdown();
      }
   }, [timeLeft]);

   useEffect(() => {
      if (!getOrderById.data?.data || !info) return;

      const purpose = `tmdt${getOrderById.data.data._id}-${info._id}-`;
      const amount = getOrderById.data.data.totalPrice.toString();

      if (getOrderById.data.data.paymentMethod === EOrderPaymentMethod[`Momo`]) {
         if (qr) return;
         createQrMomo.mutate(
            { amount, purpose },
            {
               onSuccess: (data) => {
                  setQr(data);
               },
            }
         );
      }
      if (getOrderById.data.data.paymentMethod === EOrderPaymentMethod[`ZaloPay`]) {
         if (qr) return;
         createQrZalopay.mutate(
            { amount, purpose },
            {
               onSuccess: (data) => {
                  setQr(data);
               },
            }
         );
      }
      if (getOrderById.data.data.paymentMethod === EOrderPaymentMethod[`Bank`]) {
         if (qr) return;
         createVietQR.mutate(
            { amount, purpose },
            {
               onSuccess: (data) => {
                  setQr(data);
               },
            }
         );
      }
   }, [getOrderById.data?.data, info]);

   useEffect(() => {
      return () => {
         dispatch(SET_IS_CHECK_TRANSACTION(false));
         stopCountdown();
      };
   }, []);

   return (
      <>
         <Container pt={50} pb={100}>
            <Stack>
               <TextBack />

               <Paper shadow="md" radius="lg" withBorder p="xl" pos={`relative`} mih={500}>
                  <LoadingOverlay visible={getOrderById.isPending} zIndex={1000} overlayProps={{ radius: "sm", bg: `transparent` }} />
                  <NodataOverlay visiable={getOrderById.isError} />
                  {getOrderById.data && (
                     <Stack>
                        <Center>
                           <Text style={{ color: theme.colors.shopee[5], fontSize: 22, fontWeight: 800 }}>ĐƠN HÀNG</Text>
                        </Center>

                        {timeLeft === 0 && (
                           <Stack>
                              <Text ta={`center`} fz={`lg`} fw={600}>
                                 Hết thời gian thanh toán
                              </Text>
                           </Stack>
                        )}
                        {timeLeft > 0 && (
                           <Center>
                              <Group gap={5}>
                                 <Text c="red" fw={600}>
                                    Thời gian thanh toán còn lại:
                                 </Text>
                                 <motion.div
                                    key={Math.floor(timeLeft / 60)}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    exit={{ y: -30 }}
                                    transition={{
                                       type: "spring",
                                       stiffness: 300,
                                       damping: 10,
                                       duration: 0.5,
                                    }}
                                 >
                                    <Text c="red" fw={600}>
                                       {Math.floor(timeLeft / 60)}
                                    </Text>
                                 </motion.div>
                                 <Text c="red" fw={600}>
                                    phút
                                 </Text>
                                 <motion.div
                                    key={timeLeft % 60}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    exit={{ y: -30 }}
                                    transition={{
                                       type: "spring",
                                       stiffness: 300,
                                       damping: 10,
                                       duration: 0.5,
                                    }}
                                 >
                                    <Text c="red" fw={600}>
                                       {timeLeft % 60}
                                    </Text>
                                 </motion.div>
                                 <Text c="red" fw={600}>
                                    giây
                                 </Text>
                              </Group>
                           </Center>
                        )}
                        {getOrderById.data?.data?.status === EOrderStatus[`Paid`] && (
                           <Stack>
                              <Center>
                                 <IconCircleCheckFilled color="green" size={100} />
                              </Center>
                              <Center>
                                 <Box>
                                    <Text ta={`center`} fz={`h2`} fw={600}>
                                       Thanh toán thành công
                                    </Text>
                                    <Group>
                                       <Text opacity={0.5}>Đơn hàng</Text>
                                       <Text fw={600}>{getOrderById.data.data._id as string}</Text>
                                    </Group>
                                 </Box>
                              </Center>
                           </Stack>
                        )}
                        {getOrderById.data?.data?.paymentMethod === EOrderPaymentMethod[`Cash on Delivery`] && (
                           <Stack>
                              <Center>
                                 <IconCircleCheckFilled color="green" size={100} />
                              </Center>
                              <Center>
                                 <Box>
                                    <Text ta={`center`} fz={`h2`} fw={600}>
                                       Thanh toán khi nhận hàng
                                    </Text>
                                    <Group>
                                       <Text opacity={0.5}>Đơn hàng</Text>
                                       <Text fw={600}>{getOrderById.data.data._id as string}</Text>
                                    </Group>
                                 </Box>
                              </Center>
                           </Stack>
                        )}

                        <Collapse in={openedQr}>
                           <Stack>
                              <Center>
                                 <Paper shadow="sm" radius={25} withBorder p="sm" w={`min-content`}>
                                    <Box style={{ width: 300, height: 300, borderRadius: `20px`, overflow: `hidden`, position: `relative` }}>
                                       <LoadingOverlay
                                          visible={createQrMomo.isPending || createQrZalopay.isPending || createVietQR.isPending}
                                          zIndex={1000}
                                          overlayProps={{ radius: "sm", bg: `transparent` }}
                                       />
                                       {qr && (
                                          <Box style={{ width: `100%`, height: `100%`, position: `relative` }}>
                                             <Box
                                                style={{
                                                   position: `absolute`,
                                                   top: `50%`,
                                                   left: `50%`,
                                                   width: `auto`,
                                                   height: `auto`,
                                                   zIndex: 1,
                                                   transform: `translate(-50%, -50%)`,
                                                   borderRadius: `50%`,
                                                   backgroundColor: `#fff`,
                                                   display: `flex`,
                                                   alignItems: `center`,
                                                   justifyContent: `center`,
                                                   padding: 10,
                                                }}
                                             >
                                                <Image
                                                   src={`/logo-payment/${getOrderById.data?.data?.paymentMethod}.webp`}
                                                   width={35}
                                                   height={35}
                                                   style={{ display: "block" }}
                                                   alt="qr-image"
                                                />
                                             </Box>
                                             <Image
                                                src={qr}
                                                width={0}
                                                height={0}
                                                style={{ display: "block", width: `100%`, height: `100%` }}
                                                alt="qr-image"
                                             />
                                          </Box>
                                       )}
                                    </Box>
                                 </Paper>
                              </Center>
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
                           </Stack>
                        </Collapse>

                        {getOrderById.data?.data?.status === EOrderStatus[`Paid`] || timeLeft === 0 ? (
                           <Stack>
                              <Center>
                                 <Button onClick={() => router.push(ROUTER_CLIENT.CART)} variant="outline">
                                    Tiếp tục mua sắm
                                 </Button>
                              </Center>
                              <Center>
                                 <Text
                                    onClick={() => {
                                       router.push(ROUTER_CLIENT.TRANSACTION);
                                    }}
                                    style={{ textDecoration: `underline`, cursor: `pointer`, opacity: 0.5 }}
                                 >
                                    Lịch sử thanh toán
                                 </Text>
                              </Center>
                           </Stack>
                        ) : (
                           <Center>
                              {getOrderById.data?.data?.paymentMethod !== EOrderPaymentMethod[`Cash on Delivery`] && (
                                 <Button onClick={handleConfirmAction.open} variant="outline">
                                    Huỷ
                                 </Button>
                              )}
                           </Center>
                        )}

                        <Divider />

                        <Center w={`100%`}>
                           <Stack style={{ overflowY: `auto`, maxWidth: `360px`, width: `100%`, maxHeight: `150px` }}>
                              <Group justify="space-between">
                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    Tên sản phẩm
                                 </Text>
                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    Số lượng
                                 </Text>
                              </Group>
                              {getOrderById.data?.data?.products.map((item, i) => {
                                 return (
                                    <Group key={i} justify="space-between">
                                       <Text maw={`80%`} truncate>
                                          {item.productId.name}
                                       </Text>
                                       <Text>x{item.quantity}</Text>
                                    </Group>
                                 );
                              })}
                           </Stack>
                        </Center>

                        <Divider />

                        <Center w={`100%`}>
                           <Stack maw={360} w={`100%`}>
                              <Group align="baseline" justify="space-between">
                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    Tổng tiền hàng:
                                 </Text>

                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    ₫{renderData(getOrderById.data?.data?.totalPriceItemCart)}
                                 </Text>
                              </Group>
                              <Group align="baseline" justify="space-between">
                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    Tổng tiền phí vận chuyển:
                                 </Text>

                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    ₫{renderData(getOrderById.data?.data?.totalShipItemCart)}
                                 </Text>
                              </Group>
                              <Group align="baseline" justify="space-between">
                                 <Text style={{ fontSize: 14 }} opacity={0.5}>
                                    Tổng thanh toán:
                                 </Text>

                                 <Text style={{ fontSize: 25, color: theme.colors.shopee[5], fontWeight: 900 }}>
                                    ₫{renderData(getOrderById.data?.data?.totalPrice)}
                                 </Text>
                              </Group>
                           </Stack>
                        </Center>
                     </Stack>
                  )}
               </Paper>
            </Stack>
         </Container>
         {getOrderById.data?.data?._id && (
            <ModalConfirmAction
               title={`Bạn có muốn huỷ đơn hàng?`}
               opened={openedConfirmAction}
               close={handleConfirmAction.close}
               mutationDelete={useDeleteOrder}
               onSuccess={() => {
                  router.push(ROUTER_CLIENT.CART);
               }}
               id={getOrderById.data.data._id}
            />
         )}
      </>
   );
}
