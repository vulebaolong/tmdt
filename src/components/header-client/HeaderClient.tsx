"use client";

import DrawerNavbar from "@/components/drawer/drawer-navbar/DrawerNavbar";
import ButtonToggleTheme from "@/components/toggle-theme/button/ButtonToggleTheme";
import { MOBILE_HIDDEN_DESKTOP_VISIBLE, MOBILE_VISIBLE_DESKTOP_HIDDEN } from "@/constant/app.constant";
import ROUTER from "@/constant/router.constant";
import { useAppSelector } from "@/redux/hooks";
import { useQueryInfo } from "@/tantask/auth.tanstack";
import { useCartCountQuery } from "@/tantask/cart.tanstack";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";
import { Box, Burger, Container, Divider, Group, Indicator, Loader, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandFacebookFilled, IconBrandInstagramFilled, IconShoppingCart } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InputSearchHeader from "../input-search-header/InputSearchHeader";
import { LogoIcon } from "../logo/LogoIcon";
import SwitchLangV2 from "../switch-lang/SwitchLangV2";
import Text from "../text-custom/TextCustom";
import UserControl from "../user-control/UserControl";
import classes from "./HeaderClient.module.css";

export default function HeaderClient() {
   const [opened, handleDrawerNavbar] = useDisclosure(false);
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();
   const theme = useMantineTheme();
   const cartCountQuery = useCartCountQuery();

   useQueryInfo();
   useCheckTransaction();

   return (
      <>
         <header className={`${classes[`header`]}`}>
            <Container w={`100%`}>
               <Stack>
                  <Group mt={-10} align="center" justify="space-between" h={40} className={`${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}>
                     <Group align="center" gap={5}>
                        <Text className={`${classes[`text-1`]}`}>Seller Channel</Text>
                        <Divider style={{ alignSelf: `unset` }} color="white" opacity={0.7} h={15} orientation="vertical" />
                        <Text className={`${classes[`text-1`]}`}>Download App</Text>
                        <Divider style={{ alignSelf: `unset` }} color="white" opacity={0.7} h={15} orientation="vertical" />
                        <Text className={`${classes[`text-1`]}`}>Connect</Text>
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
                                 Register
                              </Text>
                              <Text
                                 onClick={() => {
                                    router.push(ROUTER.LOGIN);
                                 }}
                                 style={{ cursor: "pointer" }}
                                 className={`${classes[`text-2`]}`}
                              >
                                 Login
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

                        <LogoIcon />
                     </Group>

                     {/* center */}
                     <Box style={{ flex: `1` }} className={`${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}>
                        <InputSearchHeader />
                     </Box>

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
                                 {cartCountQuery.data || 0}
                              </motion.div>
                           )
                        }
                        size={20}
                        color={`white`}
                        styles={{ indicator: { color: theme.colors.shopee[5], fontWeight: `bold`, fontSize: `15px` } }}
                        disabled={cartCountQuery.isLoading || !cartCountQuery.data}
                     >
                        <IconShoppingCart
                           onClick={() => {
                              router.push(ROUTER.CART);
                           }}
                           stroke={2}
                           size={30}
                           color="white"
                           style={{ cursor: `pointer` }}
                        />
                     </Indicator>
                  </Group>
               </Stack>
            </Container>
         </header>
         <DrawerNavbar opened={opened} close={handleDrawerNavbar.close} />
      </>
   );
}
