"use client";

import { useProducts } from "@/tantask/product.tanstack";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";

export default function ProductCarousel() {
   const products = useProducts({ pagination: { pageIndex: 1, pageSize: 100 } });

   return (
      <Carousel
         withIndicators
         height={500}
         slideSize={{ base: "100%", md: "25%" }}
         slideGap={`sm`}
         emblaOptions={{ loop: true, align: "start" }}
         styles={(theme) => {
            return {
               indicator: {
                  zIndex: 5,
                  background: `white`,
                  border: `1px solid ${theme.colors.spaTheme[5]}`,
                  width: `12px`,
                  height: `12px`,
                  transition: "all 0.3s ease",

                  "&[data-active]": {
                     background: theme.colors.spaTheme[5],
                     border: `1px solid ${theme.colors.spaTheme[5]}`,
                     width: `12px`,
                     height: `12px`,
                     transition: "all 0.3s ease",
                  },
               },
               control: {
                  background: theme.colors.spaTheme[5],
                  color: `white`,
               },
            };
         }}
      >
         {products.data?.items.map((service, i) => {
            return (
               <Carousel.Slide key={i}>
                  <Stack
                     sx={{
                        height: "100%",
                        background: `white`,
                        alignItems: "center",
                     }}
                  >
                     {i}
                  </Stack>
               </Carousel.Slide>
            );
         })}
      </Carousel>
   );
}
