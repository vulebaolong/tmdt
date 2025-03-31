"use client";

import ModalAddReceivingInformation from "@/components/modal/add-receiving-information/ModalAddReceivingInformation";
import ProductImage from "@/components/product/product-image/ProductImage";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/hooks";
import { IProduct } from "@/schemas/product.schema";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";
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
   NumberInput,
   Paper,
   Stack,
   Text,
   Transition,
   useMantineTheme,
} from "@mantine/core";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconBuildingBank, IconChevronDown, IconChevronUp, IconEdit, IconMapPinFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import classes from "./ProductPayment.module.css";

type TProps = {
   product: IProduct;
};

export default function ProductPayment({ product }: TProps) {
   const [quantity, { increment, decrement, set }] = useCounter(1, { min: 1 });
   const [vietQr, setVietQr] = useState<string | null>(null);
   const [qrMomo, setQrMomo] = useState<string | null>(null);
   const [qrZalopay, setQrZalopay] = useState<string | null>(null);
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   const [openedModalAdd, handleModalAdd] = useDisclosure(false);
   const [openedQr, handleQr] = useDisclosure(false);
   const [typePayment, setTypePayment] = useState(ETypePayment[`Momo`]);

   const { data } = useCheckTransaction();
   const createQrMomo = useCreateQrMomo();
   const createQrZalopay = useCreateQrZalopay();
   const createVietQR = useCreateVietQR();

   useEffect(() => {
      if (!info?._id) return;

      if (typePayment === ETypePayment[`Momo`]) {
         if (qrMomo) return;
         createQrMomo.mutate(
            { amount: total.totalPayment.toString(), purpose: `tmdt${product._id}-${info._id}-` },
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
            { amount: total.totalPayment.toString(), purpose: `tmdt${product._id}-${info._id}-` },
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
            { amount: total.totalPayment.toString(), purpose: `tmdt${product._id}-${info._id}-` },
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
      handleQr.open();
      // if (!info?._id) return toast.warning(`Bạn cần đăng nhập để mua hàng`);

      // const vietQR = await createVietQR(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);
      // const qrMomo = await createQRMomopay(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);
      // const qrZalopay = await createQRZalopay(total.totalPayment.toString(), `tmdt${product._id}-${info._id}-`);

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
                     router.push(`${ROUTER.PRODUCT.ROOT}/${product._id}`);
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
                     {[0, 1, 2, 3, 4, 5].map((item, i) => {
                        return (
                           <Fragment key={i}>
                              <Stack>
                                 <Box>
                                    <Text style={{ fontSize: 14 }} opacity={0.5}>
                                       Tên
                                    </Text>
                                    <Text>{product.name}</Text>
                                 </Box>

                                 <Box w={100}>
                                    <ProductImage src={product.imagePublicId} />
                                 </Box>

                                 <Box className={`${classes[`box-2`]}`}>
                                    <Stack className={`${classes[`box-4`]}`} align="baseline">
                                       <Text style={{ fontSize: 14 }} opacity={0.5}>
                                          Đơn Giá
                                       </Text>
                                       <Text>₫{renderData(product.price)}</Text>
                                    </Stack>
                                    <Stack className={`${classes[`box-4`]}`}>
                                       <Text style={{ fontSize: 14 }} opacity={0.5}>
                                          Số Lượng
                                       </Text>
                                       <Group gap={2}>
                                          <ActionIcon disabled={openedQr} variant="default" size="md" radius="md" onClick={decrement}>
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
                                          <ActionIcon disabled={openedQr} variant="default" size="md" radius="md" onClick={increment}>
                                             <IconChevronUp color="var(--mantine-color-teal-text)" />
                                          </ActionIcon>
                                       </Group>
                                    </Stack>
                                    <Stack className={`${classes[`box-4`]}`} align="baseline">
                                       <Text style={{ fontSize: 14 }} opacity={0.5}>
                                          Thành Tiền
                                       </Text>
                                       <Text style={{ fontWeight: 900 }}>₫{renderData(total.productTotal)}</Text>
                                    </Stack>
                                    <Button variant="outline" w={100} size="xs">Xoá</Button>
                                 </Box>
                              </Stack>
                              <Divider />
                           </Fragment>
                        );
                     })}

                     <Box className={`${classes[`box-2`]} ${classes[`ship`]}`}>
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
                        <Button disabled={openedQr} onClick={handleOrder} size="lg" w={150} color={theme.colors.shopee[5]}>
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
                                             <LoadingOverlay visible={createQrMomo.isPending} />
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
                                             <LoadingOverlay visible={createQrZalopay.isPending} />
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
                                             <LoadingOverlay visible={createVietQR.isPending} />
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
