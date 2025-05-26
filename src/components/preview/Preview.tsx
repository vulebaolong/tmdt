"use client";

import { Carousel } from "@mantine/carousel";
import { Box, Center, Container, Stack, Text } from "@mantine/core";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { titleSx } from "../provider/mantine/sx/text.sx";

const listPreview = [
   {
      text: ` Tina là nơi có thể đi "trốn" một mình khi cần hoặc làm nơi hẹn hò với bạn bè đều tốt! Mà đâu có xa xôi gì, ngay giữa trung tâm Sài Gòn tấp nập nữa mới hay chứ. Bởi vậy bạn cần dẫn đến có một lần à, là chị mua thẻ member nguyện làm "thành viên" của nhà Tina luôn".`,
      img: `/section/5-1.webp`,
   },
   {
      text: ` Tina là nơi có thể đi "trốn" một mình khi cần hoặc làm nơi hẹn hò với bạn bè đều tốt! Mà đâu có xa xôi gì, ngay giữa trung tâm Sài Gòn tấp nập nữa mới hay chứ. Bởi vậy bạn cần dẫn đến có một lần à, là chị mua thẻ member nguyện làm "thành viên" của nhà Tina luôn".`,
      img: `/section/5-2.webp`,
   },
   {
      text: ` Tina là nơi có thể đi "trốn" một mình khi cần hoặc làm nơi hẹn hò với bạn bè đều tốt! Mà đâu có xa xôi gì, ngay giữa trung tâm Sài Gòn tấp nập nữa mới hay chứ. Bởi vậy bạn cần dẫn đến có một lần à, là chị mua thẻ member nguyện làm "thành viên" của nhà Tina luôn".`,
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
                     >
                        Góc thân quen...
                     </Text>
                  </Center>
                  <Center>
                     <Text
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
            </Stack>
         </Container>
      </Box>
   );
}
