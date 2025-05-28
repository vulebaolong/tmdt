"use client";

import { Box, Container, Divider, Group, Stack, Text } from "@mantine/core";
import { Fragment } from "react";
import { titleSx } from "../provider/mantine/sx/text.sx";
import CarouselService from "./CarouselService";

const list = [
   { t: 1700, d: `Khách hàng/tháng` },
   { t: 10, d: `Nhân viên` },
   { t: `99%`, d: `Tỉ lệ hài lòng của khách hàng` },
   { t: 1, d: `Chi nhánh` },
];

export default function ServiceNail() {
   return (
      <Box
         component="section"
         id="service"
         sx={{
            height: 900,
            backgroundImage: `url(/section/3.webp)`,
            backgroundPosition: `bottom center`,
            backgroundRepeat: `no-repeat`,
            backgroundColor: `transparent`,
         }}
      >
         <Container sx={{ height: `100%` }}>
            <Stack sx={{ width: `100%`, height: `100%`, justifyContent: `space-evenly` }}>
               <Text
                  sx={(theme, u) => {
                     return { ...titleSx(theme, u), textAlign: `center` };
                  }}
                  data-aos="fade-right"
               >
                  Top dịch vụ trong tháng
               </Text>

               <Box data-aos="fade-up" data-aos-delay="300">
                  <CarouselService />
               </Box>

               <Group sx={{ justifyContent: `space-between`, alignItems: `center` }}>
                  {list.map((item, i) => {
                     return (
                        <Fragment key={i}>
                           {i > 0 && <Divider orientation="vertical" opacity={0.5} color="rgba(255,255,255,0.9)" size={1} />}
                           <Stack data-aos="fade-up" data-aos-delay={i * 100}>
                              <Text
                                 sx={(theme) => {
                                    return {
                                       textAlign: `center`,
                                       fontWeight: 400,
                                       lineHeight: `88px`,
                                       fontSize: 88,
                                       color: theme.colors.spaTheme[5],
                                    };
                                 }}
                              >
                                 {item.t}
                              </Text>
                              <Text
                                 sx={(theme) => {
                                    return {
                                       fontWeight: 500,
                                       fontSize: 22,
                                       color: theme.colors.spaTheme[5],
                                    };
                                 }}
                              >
                                 {item.d}
                              </Text>
                           </Stack>
                        </Fragment>
                     );
                  })}
               </Group>
            </Stack>
         </Container>
      </Box>
   );
}
