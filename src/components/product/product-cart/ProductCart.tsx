"use client";

import { TCreateOrder } from "@/actions/order.action";
import ModalAddReceivingInformation from "@/components/modal/add-receiving-information/ModalAddReceivingInformation";
import ModalCheckOrderPending from "@/components/modal/check-order-pending/ModalCheckOrderPending";
import TextBack from "@/components/text-back/TextBack";
import ROUTER_CLIENT from "@/constant/router.constant";
import { getDeliveryDateRange, renderData } from "@/helpers/function.helper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_IS_CHECK_TRANSACTION } from "@/redux/slices/transaction.slice";
import { useGetCartList } from "@/tantask/cart.tanstack";
import { useCheckPendingOrder, useCreateOrder } from "@/tantask/order.tanstack";
import { EOrderPaymentMethod } from "@/types/enum/order.enum";
import { ActionIcon, Box, Button, Center, Container, Divider, Group, Paper, Radio, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconMapPinFilled } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import useRouter from "@/hooks/use-router-custom";
import { useState } from "react";
import ProductListCart from "./product-list-cart/ProductListCart";
import classes from "./ProductCart.module.css";

export type TTotalPrice = { totalPriceItemCart: number; totalShipItemCart: number; totalPriceCart: number };

export default function ProductCart() {
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const [openedModalAdd, handleModalAdd] = useDisclosure(false);
   const [openedModalCheck, handleModalCheck] = useDisclosure(false);
   const [totalPrice, setTotalPrice] = useState<TTotalPrice>({ totalPriceItemCart: 0, totalShipItemCart: 0, totalPriceCart: 0 });
   const [pagination] = useState({ pageIndex: 0, pageSize: 10 });
   const [paymentMethod, setPaymentMethod] = useState(0);
   const [loadingChange, setLoadingChange] = useState(false);

   const getCartList = useGetCartList(pagination);
   const createOrder = useCreateOrder();
   const queryClient = useQueryClient();
   const checkPendingOrder = useCheckPendingOrder();

   const handleOrder = async () => {
      const isOrder = await checkPendingOrder.mutateAsync();

      if (isOrder && (paymentMethod !== EOrderPaymentMethod[`Cash on Delivery`])) {
         handleModalCheck.open();
         return;
      }

      await queryClient.fetchQuery({ queryKey: [`cart-count`] });
      if (!getCartList.data?.items) return;
      console.log({ getCartList: getCartList.data.items });
      const payload: TCreateOrder = {
         products: getCartList.data.items.map((item) => ({
            productId: item.productId._id as string,
            quantity: item.quantity,
            price: item.productId.price,
            shippingFee: item.productId.shippingFee,
         })),
         totalPriceItemCart: totalPrice.totalPriceItemCart,
         totalShipItemCart: totalPrice.totalShipItemCart,
         totalPrice: totalPrice.totalPriceCart,
         paymentMethod: paymentMethod,
      };
      await createOrder.mutateAsync(payload, {
         onSuccess: (res) => {
            if (res.data.paymentMethod === EOrderPaymentMethod[`Cash on Delivery`]) {
               router.push(`${ROUTER_CLIENT.ORDER}/${res.data._id}`);
            } else {
               dispatch(SET_IS_CHECK_TRANSACTION(2000));
               router.push(`${ROUTER_CLIENT.ORDER}/${res.data._id}`);
            }
         },
      });
   };

   return (
      <>
         <Container pt={50} pb={100}>
            <Stack>
               <TextBack />

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
                  <Stack style={{ filter: `blur(${!info?.address || !info?.phone ? `2px` : `0px`})` }}>
                     <Group gap={5}>
                        <IconMapPinFilled color={theme.colors.spaTheme[5]} />
                        <Text style={{ color: theme.colors.spaTheme[5], fontSize: 22, fontWeight: 800 }}>Địa Chỉ Nhận Hàng</Text>
                        <ActionIcon onClick={handleModalAdd.open} variant="transparent">
                           <IconEdit color={theme.colors.spaTheme[5]} />
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
                     <ProductListCart cartList={getCartList} setTotalPrice={setTotalPrice} setLoadingChange={setLoadingChange} />

                     <Stack>
                        <Text style={{ fontWeight: 900 }}>Phương thức vận chuyển</Text>
                        <Box>
                           <Text style={{ fontSize: 14 }}>Giao hàng tận nơi</Text>
                           <Group gap={2} align="center">
                              <Image
                                 width={15}
                                 height={15}
                                 sizes="100vw"
                                 alt="product-shipping"
                                 src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/a714965e439d493ba00c.svg"
                                 style={{ display: `block` }}
                              />
                              <Text h={15} style={{ color: `#26aa99`, fontSize: 12, lineHeight: 1.3 }}>
                                 Nhận hàng từ {getDeliveryDateRange()}
                              </Text>
                           </Group>
                        </Box>
                     </Stack>

                     <Divider />

                     <Stack>
                        <Radio.Group
                           value={paymentMethod.toString()}
                           onChange={(e) => {
                              setPaymentMethod(Number(e));
                           }}
                           label={<Text style={{ fontWeight: 900 }}>Phương thức thanh toán</Text>}
                        >
                           <Stack mt="lg">
                              {Object.values(EOrderPaymentMethod).map((item) => {
                                 if (typeof item === "string") return null;
                                 return (
                                    <Radio
                                       key={item}
                                       value={item.toString()}
                                       label={
                                          <Group>
                                             <Image src={`/logo-payment/${item}.webp`} width={25} height={25} alt="logo-method-payment" />
                                             <Text>{EOrderPaymentMethod[item]}</Text>
                                          </Group>
                                       }
                                    />
                                 );
                              })}
                           </Stack>
                        </Radio.Group>
                     </Stack>

                     <Divider />

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

                              <Text style={{ fontSize: 25, color: theme.colors.spaTheme[5], fontWeight: 900 }}>
                                 ₫{renderData(totalPrice.totalPriceCart)}
                              </Text>
                           </Group>
                        </Stack>
                     </Group>

                     <Divider />

                     <Group justify="end">
                        <Button
                           loading={createOrder.isPending}
                           disabled={!info?.address || !info?.phone || !getCartList.data?.items.length || getCartList.isError || loadingChange}
                           onClick={handleOrder}
                           size="lg"
                           w={150}
                           color={theme.colors.spaTheme[5]}
                        >
                           Đặt Hàng
                        </Button>
                     </Group>
                  </Stack>
               </Paper>
            </Stack>
         </Container>
         <ModalAddReceivingInformation opened={openedModalAdd} close={handleModalAdd.close} />
         {checkPendingOrder.data && (
            <ModalCheckOrderPending
               opened={openedModalCheck}
               close={handleModalCheck.close}
               onCancel={handleModalCheck.close}
               onSubmit={() => {
                  router.push(`${ROUTER_CLIENT.ORDER}/${checkPendingOrder.data}`);
               }}
               title="Bạn Có Đơn Hàng Đang Chờ Thanh Toán"
            />
         )}
      </>
   );
}
