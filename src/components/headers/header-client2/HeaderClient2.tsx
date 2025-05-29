"use client";

import DrawerNavbar from "@/components/drawer/drawer-navbar/DrawerNavbar";
import { Logo2 } from "@/components/logo2/Logo2";
import { hoverColor5 } from "@/components/provider/mantine/sx/text.sx";
import UserControl2 from "@/components/user-control2/UserControl2";
import { MOBILE_HIDDEN_DESKTOP_VISIBLE, MOBILE_VISIBLE_DESKTOP_HIDDEN } from "@/constant/app.constant";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { useGetInfoQuery } from "@/tantask/auth.tanstack";
import { useCartCountQuery } from "@/tantask/cart.tanstack";
import { useCheckTransaction } from "@/tantask/check-transaction.tanstack";
import { Box, Burger, Container, Group, Indicator, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPhoneCall, IconShoppingBag } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

export const listNav = [
   { title: "Trang chủ", id: "Home" },
   { title: "Giới thiệu", id: "about" },
   { title: "Dịch vụ", id: "service" },
   { title: "Sản phẩm", id: "product" },
   { title: "Tin tức", id: "blog" },
];

export default function HeaderClient2() {
   const info = useAppSelector((state) => state.user.info);
   const cartCountQuery = useCartCountQuery();
   const router = useRouter();
   const pathname = usePathname();
   const [opened, handleDrawerNavbar] = useDisclosure(false);

   useGetInfoQuery();
   useCheckTransaction();

   return (
      <>
         <header style={{ position: pathname === ROUTER_CLIENT.HOME ? `absolute` : `unset`, top: 0, left: 0, right: 0, zIndex: 101 }}>
            <Box
               sx={(theme) => {
                  return {
                     background: pathname === ROUTER_CLIENT.HOME ? `transparent` : theme.colors.spaTheme[7],
                  };
               }}
            >
               <Container>
                  <Group
                     sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: `var(--height-header-client)`,
                        borderBottom: "1px solid rgba(250,243,235,0.28)",
                     }}
                  >
                     <Group sx={{ gap: 2, color: "white" }}>
                        <IconPhoneCall size={16} stroke={1} />
                        <Text style={{ fontWeight: 400, fontSize: `14px` }}>
                           Hotline đặt lịch:{" "}
                           <Text
                              component="span"
                              sx={(theme, u) => ({
                                 color: "white",
                                 ...hoverColor5(theme, u),
                              })}
                           >
                              1900 6750
                           </Text>
                        </Text>
                     </Group>

                     <Group>
                        <UserControl2 colorText="white" />
                        <Group
                           gap={2}
                           sx={(theme, u) => {
                              return {
                                 color: "white",
                                 ...hoverColor5(theme, u),
                              };
                           }}
                           onClick={() => {
                              if (info) {
                                 router.push(ROUTER_CLIENT.CART);
                              } else {
                                 toast.info("Vui lòng đăng nhập");
                              }
                           }}
                        >
                           <IconShoppingBag size={16} stroke={1} />
                           <Text style={{ fontWeight: 400, fontSize: `14px` }}>Giỏ hàng</Text>
                           {info && (
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
                                 styles={(theme) => {
                                    return { indicator: { color: theme.colors[theme.primaryColor][5], fontWeight: `bold`, fontSize: `15px` } };
                                 }}
                                 disabled={cartCountQuery.isLoading || !cartCountQuery.data}
                              >
                                 <Box w={20} />
                              </Indicator>
                           )}
                        </Group>
                     </Group>
                  </Group>
               </Container>
            </Box>

            <Container>
               <Box
                  className={`${MOBILE_VISIBLE_DESKTOP_HIDDEN}`}
                  sx={(theme) => {
                     return {
                        backgroundColor: theme.colors.spaTheme[5],
                        width: `fit-content`,
                        borderRadius: `8px`,
                        overflow: `hidden`,
                        marginTop: `10px`,
                     };
                  }}
               >
                  <Burger
                     color="white"
                     sx={(_, u) => {
                        return {
                           [u.light]: {
                              color: "white",
                           },
                        };
                     }}
                     size={"sm"}
                     opened={opened}
                     onClick={handleDrawerNavbar.open}
                  />
               </Box>
               <Group
                  className={` ${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}
                  sx={(theme) => {
                     return {
                        justifyContent: "space-between",
                        borderBottom: pathname === ROUTER_CLIENT.HOME ? "unset" : `1px solid ${theme.colors.spaTheme[5]}`,
                        padding: `10px 0`,
                     };
                  }}
               >
                  <Box data-aos="fade-right">
                     <Logo2 width={70} />
                  </Box>

                  <Group gap={50}>
                     {listNav.map((item, i) => (
                        <Text
                           data-aos="fade-up"
                           data-aos-delay={i * 100}
                           key={i}
                           sx={(theme, u) => {
                              return {
                                 fontWeight: 600,
                                 fontSize: `18px`,
                                 color: pathname === ROUTER_CLIENT.HOME ? "white" : "#a39a92",
                                 position: "relative",
                                 ":before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    bottom: -5,
                                    width: 0,
                                    height: 2,
                                    backgroundColor: theme.colors[theme.primaryColor][5],
                                    transition: "width 150ms ease",
                                 },
                                 ":hover::before": {
                                    width: "100%",
                                 },
                                 ...hoverColor5(theme, u),
                              };
                           }}
                           onClick={() => {
                              router.push(`/${ROUTER_CLIENT.HOME}#${item.id}`);
                           }}
                        >
                           {item.title}
                        </Text>
                     ))}
                  </Group>
               </Group>
            </Container>
         </header>
         <DrawerNavbar opened={opened} close={handleDrawerNavbar.close} />
      </>
   );
}
