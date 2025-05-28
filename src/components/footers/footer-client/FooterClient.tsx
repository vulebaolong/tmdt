"use client";

import { Logo2 } from "@/components/logo2/Logo2";
import PhoneLink from "@/components/phone-link/PhoneLink";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { ActionIcon, Box, Button, Container, Divider, Group, rem, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconMapPinFilled, IconPhoneFilled } from "@tabler/icons-react";
import FooterAdmin from "../footer-admin/FooterAdmin";

export default function FooterClient() {
   const router = useRouter();
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);

   return (
      <Box component="footer" sx={{ background: `#150801`, paddingTop: `40px` }}>
         <Container>
            <Box
               sx={(theme, u) => {
                  return {
                     display: `grid`,

                     gap: theme.spacing.md,
                     [u.smallerThan("md")]: {
                        gridTemplateColumns: `1fr`,
                     },
                     [u.largerThan("md")]: {
                        gridTemplateColumns: `1fr 1fr 1fr`,
                     },
                  };
               }}
            >
               <Stack sx={{ justifyContent: `space-between` }} data-aos="fade-right">
                  <Box sx={{ height: `70px` }}>
                     <Logo2 width={70} />
                  </Box>
                  <Text
                     sx={{
                        fontSize: 16,
                        fontWeight: 400,
                        textAlign: "justify",
                        lineHeight: `26px`,
                        color: `#e4e2e1`,
                     }}
                  >
                     Nailature mang đến lựa chọn làm đẹp nhẹ nhàng, an toàn và thân thiện với môi trường. Sản phẩm tinh tế, tối giản, tôn lên cá tính.
                     Làm đẹp là cách yêu thương bản thân và thế giới quanh ta.
                  </Text>
                  <Group gap={0} wrap="nowrap">
                     {[
                        { icon: IconBrandTwitter, link: "https://twitter.com/" },
                        { icon: IconBrandYoutube, link: "https://www.youtube.com/" },
                        { icon: IconBrandInstagram, link: "https://www.instagram.com/" },
                     ].map((item, i) => {
                        return (
                           <ActionIcon
                              key={i}
                              size="lg"
                              sx={(theme) => {
                                 return {
                                    color: theme.colors.spaTheme[5],
                                 };
                              }}
                              variant="subtle"
                              radius="xl"
                           >
                              <item.icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                           </ActionIcon>
                        );
                     })}
                  </Group>
               </Stack>

               <Stack data-aos="fade-up">
                  <Text
                     sx={(theme) => {
                        return {
                           fontSize: 20,
                           fontWeight: 600,
                           color: theme.colors.spaTheme[5],
                           textAlign: "justify",
                           textTransform: "uppercase",
                           height: `70px`,
                           lineHeight: `70px`,
                        };
                     }}
                  >
                     Liên hệ với chúng tôi
                  </Text>
                  <Group gap={5} sx={{ flexWrap: "nowrap", alignItems: "start" }}>
                     <Box
                        sx={(theme) => {
                           return { color: theme.colors.spaTheme[5] };
                        }}
                     >
                        <IconMapPinFilled size={20} />
                     </Box>
                     <Text sx={{ color: `white`, fontSize: 16, lineHeight: `24px` }}>
                        <b>Địa chỉ: </b>
                        Hàn Thuyên, khu phố 6 P, Thủ Đức, Hồ Chí Minh
                     </Text>
                  </Group>
                  <Group gap={5} sx={{ flexWrap: "nowrap", alignItems: "start" }}>
                     <Box
                        sx={(theme) => {
                           return { color: theme.colors.spaTheme[5] };
                        }}
                     >
                        <IconPhoneFilled size={20} />
                     </Box>
                     <Text sx={{ color: `white`, fontSize: 16, lineHeight: `24px` }}>
                        <b>Hotline đặt lịch: </b>
                        <PhoneLink phone="19006750" />
                        <br />
                        <b>Hotline phản ánh dịch vụ: </b>
                        <PhoneLink phone="19006750" />
                     </Text>
                  </Group>
               </Stack>

               <Stack data-aos="fade-left">
                  <Text
                     sx={(theme) => {
                        return {
                           fontSize: 20,
                           fontWeight: 600,
                           color: theme.colors.spaTheme[5],
                           textAlign: "justify",
                           height: `70px`,
                           lineHeight: `70px`,
                           textTransform: "uppercase",
                        };
                     }}
                  >
                     Đăng ký nhận khuyến mại
                  </Text>

                  <Text sx={{ color: `white`, fontSize: 16, lineHeight: `24px` }}>Đừng bỏ lỡ những sản phẩm và chương trình khuyến mại hấp dẫn</Text>

                  <Button
                     onClick={() => {
                        if (info) {
                           router.push(ROUTER_CLIENT.PRODUCT);
                        } else {
                           router.push(ROUTER_CLIENT.REGISTER);
                        }
                     }}
                     variant="gradient"
                     color={`shopee`}
                     size="lg"
                     radius="xl"
                     w={`fit-content`}
                     gradient={{ from: theme.colors.spaTheme[7], to: theme.colors.spaTheme[2], deg: 79 }}
                  >
                     {info ? `Mua ngay` : `Đăng ký ngay`}
                  </Button>
               </Stack>
            </Box>
            <Divider opacity={0.5} sx={{ marginTop: `20px` }} />
            <Box h={`40px`}>
               <FooterAdmin />
            </Box>
         </Container>
      </Box>
   );
}
