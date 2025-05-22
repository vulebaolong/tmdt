import { getCartListAction } from "@/actions/cart.action";
import NodataOverlay from "@/components/no-data/NodataOverlay";
import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { TItem, useDeleteCartItem, useHandleCart } from "@/tantask/cart.tanstack";
import { ActionIcon, Box, Button, Divider, Group, LoadingOverlay, NumberInput, Stack, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { UseQueryResult } from "@tanstack/react-query";
import useRouter from "@/hooks/use-router-custom";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import ProductImage from "../../product-image/ProductImage";
import { TTotalPrice } from "../ProductCart";
import classes from "./ProductListCart.module.css";

type TCartList = UseQueryResult<Awaited<ReturnType<typeof getCartListAction>>, unknown>;

type TProps = {
   cartList: TCartList;
   setTotalPrice: Dispatch<SetStateAction<TTotalPrice>>;
   setLoadingChange: Dispatch<SetStateAction<boolean>>;
   disabled?: boolean;
};

export default function ProductListCart({ cartList, disabled, setTotalPrice, setLoadingChange }: TProps) {
   const router = useRouter();
   const deleteCartItem = useDeleteCartItem();
   const { cartState, handleQuantityChange, totalPriceItemCart, totalShipItemCart, totalPriceCart } = useHandleCart({
      cartItems: cartList.data?.items || [],
      setLoadingChange,
   });
   useEffect(() => {
      setTotalPrice(() => {
         return { totalPriceItemCart, totalShipItemCart, totalPriceCart };
      });
   }, [totalPriceItemCart]);

   return (
      <Stack pos={"relative"} mih={270}>
         <LoadingOverlay visible={cartList.isLoading} zIndex={1000} overlayProps={{ radius: "sm", bg: `transparent` }} />
         <NodataOverlay visiable={cartList.data?.items.length === 0 || cartList.isError} />
         {cartList.data?.items.map((item: TItem, i: number) => {
            return (
               <Fragment key={i}>
                  <Stack>
                     <Box>
                        <Text style={{ fontSize: 14 }} opacity={0.5}>
                           Tên
                        </Text>
                        <Group wrap="nowrap">
                           <Text
                              onClick={() => {
                                 router.push(`${ROUTER.PRODUCT}/${item.productId._id}`);
                              }}
                              style={{ flex: `1`, cursor: `pointer` }}
                           >
                              {item.productId.name}
                           </Text>
                           <Button
                              onClick={() => {
                                 deleteCartItem.mutate({ productId: item.productId._id as string });
                              }}
                              variant="outline"
                              w={100}
                              size="xs"
                           >
                              Xoá
                           </Button>
                        </Group>
                     </Box>

                     <Box w={100}>
                        <ProductImage src={item.productId.imagePublicId} />
                     </Box>

                     <Box className={`${classes[`box-2`]}`}>
                        <Stack className={`${classes[`box-4`]}`} align="baseline">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Đơn Giá
                           </Text>
                           <Text>₫{renderData(item.productId.price)}</Text>
                        </Stack>
                        <Stack className={`${classes[`box-4`]}`}>
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Số Lượng
                           </Text>
                           <Group gap={2}>
                              <ActionIcon
                                 onClick={() =>
                                    handleQuantityChange(
                                       item.productId._id as string,
                                       Math.max(1, cartState[item.productId._id as string]?.quantity - 1)
                                    )
                                 }
                                 disabled={disabled}
                                 variant="default"
                                 size="md"
                                 radius="md"
                              >
                                 <IconChevronDown color="var(--mantine-color-red-text)" />
                              </ActionIcon>
                              <NumberInput
                                 onChange={(value) => handleQuantityChange(item.productId._id as string, Number(value))}
                                 w={50}
                                 value={cartState[(item.productId._id as any).toString()]?.quantity || 1}
                                 radius="md"
                                 size="xs"
                                 thousandSeparator=","
                                 defaultValue={1_000_000}
                                 hideControls
                              />
                              <ActionIcon
                                 onClick={() =>
                                    handleQuantityChange(item.productId._id as string, cartState[item.productId._id as string]?.quantity + 1)
                                 }
                                 disabled={disabled}
                                 variant="default"
                                 size="md"
                                 radius="md"
                              >
                                 <IconChevronUp color="var(--mantine-color-teal-text)" />
                              </ActionIcon>
                           </Group>
                        </Stack>
                        <Stack className={`${classes[`box-4`]}`} align="baseline">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Thành Tiền
                           </Text>
                           <Text style={{ fontWeight: 900 }}>₫{renderData(cartState[item.productId._id as string]?.priceItemCart || `--`)}</Text>
                        </Stack>
                        <Stack className={`${classes[`box-4`]}`} align="baseline">
                           <Text style={{ fontSize: 14 }} opacity={0.5}>
                              Phí Vận Chuyển
                           </Text>
                           <Text style={{ fontWeight: 900 }}>₫{renderData(item.productId.shippingFee)}</Text>
                        </Stack>
                     </Box>
                  </Stack>
                  <Divider />
               </Fragment>
            );
         })}
      </Stack>
   );
}
