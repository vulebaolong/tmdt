"use client";

import { hoverColor, titleSx } from "@/components/provider/mantine/sx/text.sx";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { Box, Center, Container, Stack, Text } from "@mantine/core";
import ProductCarousel from "../product-carousel/ProductCarousel";

export default function ProductNail() {
   const router = useRouter();
   return (
      <section id="product">
         <Container>
            <Stack gap={50}>
               <Center>
                  <Text
                     onClick={() => {
                        router.push(ROUTER_CLIENT.PRODUCT);
                     }}
                     sx={(theme, u) => {
                        return {
                           position: "relative",
                           width: `fit-content`,
                           "&::before": {
                              content: "''",
                              backgroundImage: `url(/section/4-1.webp)`,
                              width: `61px`,
                              height: `100%`,
                              backgroundRepeat: `no-repeat`,
                              display: `block`,
                              position: `absolute`,
                              top: `0`,
                              right: `100%`,
                              [u.largerThan("md")]: {
                                 display: `block`,
                              },
                              [u.smallerThan("md")]: {
                                 display: `none`,
                              },
                           },
                           "&::after": {
                              content: "''",
                              backgroundImage: `url(/section/4-2.webp)`,
                              width: `61px`,
                              height: `100%`,
                              backgroundRepeat: `no-repeat`,
                              display: `block`,
                              position: `absolute`,
                              top: `0`,
                              left: `calc(100% + 10px)`,
                              [u.largerThan("md")]: {
                                 display: `block`,
                              },
                              [u.smallerThan("md")]: {
                                 display: `none`,
                              },
                           },
                           ...titleSx(theme, u),
                           ...hoverColor(theme, u, theme.colors.spaTheme[6]),
                        };
                     }}
                     data-aos="fade-right"
                  >
                     Sản phẩm nổi bật
                  </Text>
               </Center>

               <Box data-aos="fade-up" data-aos-delay="300" mih={330}>
                  <ProductCarousel />
               </Box>
            </Stack>
         </Container>
      </section>
   );
}
