"use client";

import DrawerNavbar from "@/components/drawer/drawer-navbar/DrawerNavbar";
import ButtonToggleTheme from "@/components/toggle-theme/button/ButtonToggleTheme";
import { MOBILE_HIDDEN_DESKTOP_VISIBLE, MOBILE_VISIBLE_DESKTOP_HIDDEN } from "@/constant/app.constant";
import ROUTER from "@/constant/router.constant";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useQueryInfo } from "@/tantask/auth.tanstack";
import { Box, Burger, Button, Container, Divider, Group, Indicator, Input, Loader, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconSearch, IconShoppingCart } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import LogoShopee from "../logo/LogoIconText";
import SwitchLangV2 from "../switch-lang/SwitchLangV2";
import UserControl from "../user-control/UserControl";
import classes from "./HeaderClient.module.css";
import { SEARCH_PRODUCT } from "@/redux/slices/product.slice";
import { useCartCountQuery } from "@/tantask/cart.tanstack";
import { motion } from "framer-motion";

export default function HeaderClient() {
   const t = useTranslations(`header`);
   const [opened, handleDrawerNavbar] = useDisclosure(false);
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   const theme = useMantineTheme();
   const dispatch = useAppDispatch();
   const cartCountQuery = useCartCountQuery();
   useQueryInfo();

   const handleSearch = useDebouncedCallback(async (query: string) => {
      dispatch(SEARCH_PRODUCT(query));
   }, 500);

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(event.currentTarget.value);
   };

   return (
      <>
         <header className={`${classes[`header`]}`}>
            <Container w={`100%`}>
               <Stack>
                  <Group mt={-10} align="center" justify="space-between" h={40} className={`${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}>
                     <Group align="center" gap={5}>
                        <Text className={`${classes[`text-1`]}`}>Kênh Người Bán</Text>
                        <Divider style={{ alignSelf: `unset` }} color="white" opacity={0.7} h={15} orientation="vertical" />
                        <Text className={`${classes[`text-1`]}`}>Tải ứng dụng</Text>
                        <Divider style={{ alignSelf: `unset` }} color="white" opacity={0.7} h={15} orientation="vertical" />
                        <Text className={`${classes[`text-1`]}`}>Kết nối</Text>
                        <IconBrandFacebookFilled color="white" size={18} />
                        <IconBrandInstagramFilled color="white" size={18} />
                     </Group>
                     <Group align="center">
                        <SwitchLangV2 />
                        <ButtonToggleTheme color="white" variant="transparent" />
                        {info ? (
                           <UserControl />
                        ) : (
                           <>
                              <Text
                                 onClick={() => {
                                    router.push(ROUTER.REGISTER);
                                 }}
                                 style={{ cursor: "pointer" }}
                                 className={`${classes[`text-2`]}`}
                              >
                                 {t("register")}
                              </Text>
                              <Text
                                 onClick={() => {
                                    router.push(ROUTER.LOGIN);
                                 }}
                                 style={{ cursor: "pointer" }}
                                 className={`${classes[`text-2`]}`}
                              >
                                 {t("login")}
                              </Text>
                           </>
                        )}
                     </Group>
                  </Group>
                  <Group justify="space-between" wrap="nowrap">
                     {/* left */}
                     <Group gap={2} wrap="nowrap">
                        <Box className={`${MOBILE_VISIBLE_DESKTOP_HIDDEN}`}>
                           <Burger color={`white`} size={"sm"} opened={opened} onClick={handleDrawerNavbar.open} />
                        </Box>

                        <LogoShopee />
                     </Group>

                     {/* center */}
                     <Group
                        style={{
                           flex: `1`,
                           backgroundColor: `white`,
                           borderRadius: `var(--mantine-radius-md)`,
                        }}
                        gap={10}
                        p={3}
                        className={`${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}
                     >
                        <Input
                           style={{ flex: `1` }}
                           onChange={handleChange}
                           placeholder="Tìm Sản Phẩm"
                           size="md"
                           styles={{ input: { backgroundColor: `transparent`, border: `transparent`, color: `black` } }}
                        />
                        <Button size="md" color={theme.colors.shopee[5]}>
                           <IconSearch stroke={1} />
                        </Button>
                     </Group>

                     {/* right */}
                     <Indicator
                        inline
                        label={
                           cartCountQuery.isLoading ? (
                              <Loader size={10} />
                           ) : (
                                 <motion.div
                                    key={cartCountQuery.data}
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
                                    {cartCountQuery.data}
                                 </motion.div>
                           )
                        }
                        size={20}
                        color={`white`}
                        styles={{ indicator: { color: theme.colors.shopee[5], fontWeight: `bold`, fontSize: `15px` } }}
                     >
                        <IconShoppingCart stroke={2} size={30} color="white" />
                     </Indicator>
                  </Group>
               </Stack>
            </Container>
         </header>
         <DrawerNavbar opened={opened} close={handleDrawerNavbar.close} />
      </>
   );
}
