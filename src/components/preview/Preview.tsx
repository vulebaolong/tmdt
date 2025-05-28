"use client";

import { Carousel } from "@mantine/carousel";
import { Box, Center, Container, Stack, Text } from "@mantine/core";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { titleSx } from "../provider/mantine/sx/text.sx";

const listPreview = [
   {
      text: `Mình rất bất ngờ vì móng đeo lên nhẹ tênh và ôm sát móng thật, không hề cấn hay khó chịu. Màu sắc thì thanh lịch, dễ phối đồ, còn chất liệu thì thân thiện với môi trường - đúng gu mình luôn!`,
      img: `/section/5-1.webp`,
   },
   {
      text: `Nailature như “cứu cánh” mỗi lần mình cần đi tiệc gấp mà không có thời gian ra tiệm. Gắn vào 5 phút là xong, lại còn đẹp tự nhiên như móng thật. Dễ tháo, không hại móng, mình cực kỳ ưng!`,
      img: `/section/5-2.webp`,
   },
   {
      text: `Mình chọn Nailature vì đây là thương hiệu có tâm với môi trường. Mỗi bộ móng đều được đóng gói tinh tế, kỹ lưỡng. Mình cảm nhận được sự chăm chút trong từng chi tiết nhỏ. Cảm ơn Nailature đã cho mình cảm giác “đẹp mà không áy náy” với môi trường!`,
      img: `/section/5-3.webp`,
   },
];

export default function Preview() {
   return (
      <Box
         sx={{
            padding: `120px 0 100px`,
            backgroundImage: `url(/section/5.webp)`,
            backgroundPosition: `top`,
            backgroundRepeat: `no-repeat`,
            backgroundColor: `transparent`,
         }}
      >
         <Container>
            <Stack gap={50} justify="center" align="center">
               <Box>
                  <Center>
                     <Text
                        sx={(theme, u) => {
                           return {
                              position: "relative",
                              width: `fit-content`,
                              ...titleSx(theme, u),
                              color: `white`,
                           };
                        }}
                        data-aos="fade-right"
                     >
                        Góc thân quen...
                     </Text>
                  </Center>
                  <Center>
                     <Text
                        data-aos="fade-left"
                        sx={{
                           position: "relative",
                           color: `white`,
                           fontWeight: 400,
                           fontSize: 16,
                        }}
                     >
                        ...cho mình và người thân
                     </Text>
                  </Center>
               </Box>

               <Box data-aos="fade-up">
                  <Carousel
                     withIndicators
                     withControls={false}
                     slideSize={{ base: "100%" }}
                     slideGap={{ base: 0 }}
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
                        };
                     }}
                  >
                     {listPreview.map((preview, i) => {
                        return (
                           <Carousel.Slide key={i}>
                              <Stack gap={50} sx={{ padding: `50px 0`, alignItems: `center` }}>
                                 <Center>
                                    <Text
                                       sx={{
                                          "&::before": {
                                             content: '""',
                                             backgroundImage: `url(/section/5-4.webp)`,
                                             backgroundRepeat: `no-repeat`,
                                             position: `absolute`,
                                             top: `-30px`,
                                             right: `calc(100% + 20px)`,
                                             width: `68px`,
                                             height: `51px`,
                                             backgroundSize: `contain`,
                                          },
                                          position: "relative",
                                          color: `white`,
                                          fontWeight: 400,
                                          fontSize: 16,
                                          maxWidth: `80%`,
                                          textAlign: `center`,
                                       }}
                                    >
                                       {preview.text}
                                    </Text>
                                 </Center>

                                 <Box sx={{ width: `100px`, aspectRatio: `1 / 1`, borderRadius: `50%`, overflow: `hidden` }}>
                                    <ImageCustom src={preview.img} alt="" />
                                 </Box>
                              </Stack>
                           </Carousel.Slide>
                        );
                     })}
                  </Carousel>
               </Box>
            </Stack>
         </Container>
      </Box>
   );
}
