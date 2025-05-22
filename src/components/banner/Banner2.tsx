"use client";

import ROUTER from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { Box, Button, Container, Stack, Text, Title, useMantineTheme } from "@mantine/core";

export default function Banner2() {
   const router = useRouter();
   const theme = useMantineTheme();

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
                     sx={(theme) => {
                        return {
                           fontFamily: "Great Vibes, cursive",
                           maxWidth: `70%`,
                           color: theme.colors.spaTheme[1],
                           fontSize: `80px`,
                        };
                     }}
                  >
                     Đến Tina Nail ngay
                  </Title>
                  <Text c={`white`} size="xl" mt="xl" maw={`70%`}>
                     Bạn sẽ tìm thấy an yên trong không gian ấm áp, nhấp tách trà nóng. thả lỏng cho mùi hương dịu dàng và bản nhạc cũ xoa dịu tâm hồn
                     bạn, và để đôi bàn tay của đội ngũ nhân viên thân thiện và chuyên
                  </Text>

                  <Button
                     onClick={() => {
                        router.push(ROUTER.LOGIN);
                     }}
                     variant="gradient"
                     color={`shopee`}
                     size="xl"
                     radius="xl"
                     w={`fit-content`}
                     gradient={{ from: theme.colors.spaTheme[7], to: theme.colors.spaTheme[2], deg: 79 }}
                  >
                     Đặt lịch ngay
                  </Button>
               </Stack>
            </Container>
         </Box>
      </Box>
   );
}
