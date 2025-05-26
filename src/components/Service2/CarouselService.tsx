import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { useServices } from "@/tantask/service.tanstack";
import { Carousel } from "@mantine/carousel";
import { Box, Button, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { descriptionSx, hoverColor5, title2Sx } from "../provider/mantine/sx/text.sx";

const addScale = 0.1;

export default function CarouselService() {
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const [embla, setEmbla] = useState<any>(null);
   const services = useServices({ pagination: { pageIndex: 1, pageSize: 6 } });

   useEffect(() => {
      console.log(selectedIndex);
      if (!embla) return;
      const onSelect = () => {
         setSelectedIndex(embla.selectedScrollSnap());
      };
      embla.on("select", onSelect);
      onSelect();
      return () => {
         // clearTimeout(initTimeout);
         embla.off("select", onSelect);
      };
   }, [embla]);

   return (
      <Carousel
         getEmblaApi={setEmbla}
         withIndicators
         withControls={false}
         height={500}
         slideSize={{ base: "100%", md: "33.333333%" }}
         slideGap={{ base: 0 }}
         emblaOptions={{ loop: true, align: "center" }}
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
            };
         }}
      >
         {services.data?.items.map((service, i) => {
            return (
               <Carousel.Slide
                  key={i}
                  sx={{
                     zIndex: selectedIndex === i ? "2" : "1",
                  }}
               >
                  <Stack
                     sx={{
                        height: "100%",
                        transform: selectedIndex === i ? `scale(${1 + addScale}, 1)` : `scale(1, ${1 - addScale})`,
                        transition: "all 0.3s ease",
                        background: `white`,
                        borderRadius: 16,
                        boxShadow: selectedIndex === i ? `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px` : `unset`,
                        padding: 20,
                        alignItems: "center",
                     }}
                  >
                     <Box sx={{ width: `150px`, aspectRatio: `1 / 1`, borderRadius: `50%`, overflow: `hidden` }}>
                        <ImageCustom src={`${BASE_DOMAIN_CLOUDINARY}${service.thumbnail}`} alt="" />
                     </Box>
                     <Text
                        sx={(theme, u) => {
                           return { ...title2Sx(theme, u), textAlign: `center` };
                        }}
                     >
                        {service.title}
                     </Text>
                     <Text
                        sx={(theme, u) => {
                           return { ...descriptionSx(theme, u), textAlign: `center` };
                        }}
                     >
                        {service.description}
                     </Text>

                     <Text
                        sx={(theme, u) => {
                           return {
                              ...descriptionSx(theme, u),
                              ...hoverColor5(theme, u),
                           };
                        }}
                     >
                        Đặt lịch ngay
                     </Text>

                     {selectedIndex === i && (
                        <Button variant="filled" sx={{ borderRadius: `99999px` }}>
                           Tìm hiểu thêm
                        </Button>
                     )}
                  </Stack>
               </Carousel.Slide>
            );
         })}
      </Carousel>
   );
}
