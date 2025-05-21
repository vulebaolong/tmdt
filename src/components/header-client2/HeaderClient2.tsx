"use client";

import { Container, Group, Text } from "@mantine/core";
import { IconPhoneCall, IconShoppingBag, IconUser } from "@tabler/icons-react";
import { Logo2 } from "../logo2/Logo2";

export default function HeaderClient2() {
   return (
      <header style={{ position: `absolute`, top: 0, left: 0, right: 0, zIndex: 101 }}>
         <Container>
            <Group
               sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: 46,
                  borderBottom: "1px solid rgba(250,243,235,0.28)",
               }}
            >
               <Group sx={{ gap: 2, color: "white" }}>
                  <IconPhoneCall size={16} stroke={1} />
                  <Text style={{ fontWeight: 400, fontSize: `14px` }}>
                     Hotline đặt lịch:{" "}
                     <Text
                        component="span"
                        sx={(theme) => ({
                           cursor: "pointer",
                           transition: "color 150ms ease",
                           color: "white",
                           "&:hover": {
                              color: theme.colors[theme.primaryColor][5],
                           },
                        })}
                     >
                        1900 6750
                     </Text>
                  </Text>
               </Group>

               <Group>
                  <Group
                     gap={2}
                     sx={(theme) => ({
                        cursor: "pointer",
                        transition: "color 150ms ease",
                        color: "white",
                        "&:hover": {
                           color: theme.colors[theme.primaryColor][5],
                        },
                     })}
                  >
                     <IconUser size={16} stroke={1} />
                     <Text style={{ fontWeight: 400, fontSize: `14px` }}>Tài khoản</Text>
                  </Group>
                  <Group
                     gap={2}
                     sx={(theme) => ({
                        cursor: "pointer",
                        transition: "color 150ms ease",
                        color: "white",
                        "&:hover": {
                           color: theme.colors[theme.primaryColor][5],
                        },
                     })}
                  >
                     <IconShoppingBag size={16} stroke={1} />
                     <Text style={{ fontWeight: 400, fontSize: `14px` }}>Giỏ hàng</Text>
                  </Group>
               </Group>
            </Group>

            <Group sx={{ justifyContent: "space-between" }}>
               <Logo2 width={200} />
               <Group gap={50}>
                  {["Trang chủ", "Giới thiệu", "Sản phẩm", "Tin tức", "Liên hệ"].map((item) => (
                     <Text
                        key={item}
                        sx={(theme) => ({
                           fontWeight: 600,
                           fontSize: `18px`,
                           cursor: "pointer",
                           transition: "color 150ms ease",
                           color: "white",
                           position: "relative",
                           "&:hover": {
                              color: theme.colors[theme.primaryColor][5],
                           },
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
                        })}
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
