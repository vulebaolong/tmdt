"use client";

import { Logo2 } from "@/components/logo2/Logo2";
import { hoverColor5 } from "@/components/provider/mantine/sx/text.sx";
import UserControl2 from "@/components/user-control2/UserControl2";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { useCartCountQuery } from "@/tantask/cart.tanstack";
import { Box, Container, Group, Indicator, Loader, Text } from "@mantine/core";
import { IconPhoneCall, IconShoppingBag } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function HeaderClient2() {
   const info = useAppSelector((state) => state.user.info);
   const cartCountQuery = useCartCountQuery();
   const router = useRouter();

   return (
      <header style={{ position: `absolute`, top: 0, left: 0, right: 0, zIndex: 101 }}>
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
                  <UserControl2 />
                  <Group
                     gap={2}
                     sx={(theme, u) => {
                        return {
                           color: "white",
                           ...hoverColor5(theme, u),
                        };
                     }}
                     onClick={() => {
                        router.push(ROUTER_CLIENT.CART);
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

            <Group sx={{ justifyContent: "space-between" }}>
               <Logo2 width={200} />
               <Group gap={50}>
                  {["Trang chủ", "Giới thiệu", "Sản phẩm", "Tin tức", "Liên hệ"].map((item) => (
                     <Text
                        key={item}
                        sx={(theme, u) => {
                           return {
                              fontWeight: 600,
                              fontSize: `18px`,
                              color: "white",
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
                     >
                        {item}
                     </Text>
                  ))}
               </Group>
            </Group>
         </Container>
      </header>
   );
}

