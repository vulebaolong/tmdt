"use client";

import { Box, Center, Container, Stack, Text } from "@mantine/core";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { hoverColor, titleSx } from "../provider/mantine/sx/text.sx";

export default function Album() {
   return (
      <Box component="section" py={100}>
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
                     Thư viện ảnh Tina
                  </Text>
               </Center>

               <Box
                  sx={() => ({
                     display: "grid",
                     gridTemplateColumns: "repeat(3, 1fr)",
                     gap: 16,
                     gridAutoRows: "200px",

                     "@media (max-width: 992px)": {
                        gridTemplateColumns: "1fr",
                     },
                  })}
               >
                  <Box
                     sx={{
                        gridRow: "1 / 1",
                        gridColumn: "1 / 1",
                        borderRadius: "20px",
                        overflow: "hidden",
                        "@media (max-width: 992px)": {
                           gridRow: "1",
                           gridColumn: "1",
                        },
                     }}
                  >
                     <ImageCustom src="/section/7-1.webp" alt="" />
                  </Box>
                  <Box
                     sx={{
                        gridRow: "1 / 1",
                        gridColumn: "2 / 3",
                        borderRadius: "20px",
                        overflow: "hidden",
                        "@media (max-width: 992px)": {
                           gridRow: "2",
                           gridColumn: "1",
                        },
                     }}
                  >
                     <ImageCustom src="/section/7-2.webp" alt="" />
                  </Box>
                  <Box
                     sx={{
                        gridRow: "1 / 3",
                        gridColumn: "3 / 4",
                        borderRadius: "20px",
                        overflow: "hidden",
                        "@media (max-width: 992px)": {
                           gridRow: "3",
                           gridColumn: "1",
                        },
                     }}
                  >
                     <ImageCustom src="/section/7-3.webp" alt="" />
                  </Box>
                  <Box
                     sx={{
                        gridRow: "2 / 3",
                        gridColumn: "1 / 2",
                        borderRadius: "20px",
                        overflow: "hidden",
                        "@media (max-width: 992px)": {
                           gridRow: "4",
                           gridColumn: "1",
                        },
                     }}
                  >
                     <ImageCustom src="/section/7-4.webp" alt="" />
                  </Box>
                  <Box
                     sx={{
                        gridRow: "2 / 3",
                        gridColumn: "2 / 3",
                        borderRadius: "20px",
                        overflow: "hidden",
                        "@media (max-width: 992px)": {
                           gridRow: "5",
                           gridColumn: "1",
                        },
                     }}
                  >
                     <ImageCustom src="/section/7-5.webp" alt="" />
                  </Box>
               </Box>
            </Stack>
         </Container>
      </Box>
   );
}
