"use client";

import { hoverColor, titleSx } from "@/components/provider/mantine/sx/text.sx";
import { Box, Center, Container, Stack, Text } from "@mantine/core";
import ProductCarousel from "../product-carousel/ProductCarousel";

export default function ProductNail() {
   return (
      <Box>
         <Container>
            <Stack gap={50}>
               <Center>
                  <Text
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
                           },
                           ...titleSx(theme, u),
                           ...hoverColor(theme, u, theme.colors.spaTheme[6]),
                        };
                     }}
                  >
                     Sản phẩm nổi bật
                  </Text>
               </Center>

               <ProductCarousel />
            </Stack>
         </Container>
      </Box>
   );
}
