"use client";

import { TITLE } from "@/constant/app.constant";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Box, Button, Container, Stack, Text, Title, useMantineTheme } from "@mantine/core";

export default function Banner2() {
   const router = useRouter();
   const theme = useMantineTheme();
   const info = useAppSelector((state) => state.user.info);

   return (
      <Box
         pos={`relative`}
         h={`100vh`}
         sx={{
            backgroundImage: `url(/banner/bg-1.webp)`,
            backgroundSize: `cover`,
            backgroundPosition: `center`,
         }}
      >
         <Box style={{ position: `absolute`, top: 0, left: 0, width: `100%` }}>
            <Container pos={`relative`}>
               <Stack pt={`30%`}>
                  <Title
                     data-aos="fade-right"
                     sx={(theme) => {
                        return {
                           fontFamily: "Great Vibes, cursive",
                           maxWidth: `70%`,
                           color: theme.colors.spaTheme[1],
                           fontSize: `80px`,
                        };
                     }}
                  >
                     Đến {TITLE} ngay
                  </Title>
                  <Text c={`white`} size="xl" mt="xl" maw={`70%`} data-aos="fade-left">
                     Bạn sẽ tìm thấy an yên trong không gian ấm áp, nhấp tách trà nóng. thả lỏng cho mùi hương dịu dàng và bản nhạc cũ xoa dịu tâm hồn
                     bạn, và để đôi bàn tay của đội ngũ nhân viên thân thiện và chuyên
                  </Text>

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
                     size="xl"
                     radius="xl"
                     w={`fit-content`}
                     gradient={{ from: theme.colors.spaTheme[7], to: theme.colors.spaTheme[2], deg: 79 }}
                     data-aos="fade-up"
                  >
                     {info ? `Mua ngay` : `Đăng ký ngay`}
                  </Button>
               </Stack>
            </Container>
         </Box>
      </Box>
   );
}
