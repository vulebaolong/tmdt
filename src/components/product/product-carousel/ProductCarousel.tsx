"use client";

import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { useProducts } from "@/tantask/product.tanstack";
import { Carousel } from "@mantine/carousel";
import { Box, Center, Stack, Text } from "@mantine/core";

export default function ProductCarousel() {
   const products = useProducts({ pagination: { pageIndex: 1, pageSize: 100 } });

   return (
      <Carousel
         withIndicators={false}
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
         {products.data?.items.map((product, i) => {
            return (
               <Carousel.Slide key={i}>
                  <Stack
                     sx={{
                        height: "100%",
                        background: `transparent`,
                        alignItems: "center",
                     }}
                  >
                     <Box
                        sx={{
                           background: `white`,
                           borderRadius: `15px`,
                           overflow: `hidden`,
                           width: `100%`,
                           height: `auto`,
                           aspectRatio: `1 / 1`,
                           "& img": {
                              transition: "transform 0.3s ease",
                           },
                           "&:hover img": {
                              transform: "scale(1.1)",
                           },
                        }}
                     >
                        <ImageCustom src={`${BASE_DOMAIN_CLOUDINARY}${product.imagePublicId}`} alt="" />
                     </Box>
                     <Box>
                        <Center>
                           <Text truncate="end" maw={200}>
                              {product.name}
                           </Text>
                        </Center>
                        <Center>
                           <Text truncate="end" maw={200}>
                              {product.brand}
                           </Text>
                        </Center>
                     </Box>
                     <Center>
                        <Text
                           truncate="end"
                           maw={200}
                           sx={(theme) => {
                              return { fontWeight: 700, color: theme.colors.spaTheme[5] };
                           }}
                        >
                           {product.price}₫
                        </Text>
                     </Center>
                  </Stack>
               </Carousel.Slide>
            );
         })}
      </Carousel>
   );
}
