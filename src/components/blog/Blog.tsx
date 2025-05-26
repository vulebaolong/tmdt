"use client";

import { hoverColor, titleSx } from "@/components/provider/mantine/sx/text.sx";
import { useIsMobile } from "@/hooks/is-mobile.hook";
import { Center, Container, Stack, Text } from "@mantine/core";
import BlogCarousel from "./BlogCarousel";
import BlogList from "./BlogList";

const listBlog = [
   {
      title: `Các phụ kiện ngành nail giúp móng tay trở nên lung linh`,
      description: `Phụ kiện nail sticker Việc vẽ quá lâu cũng dễ làm khách hàng`,
      img: `section/6-1.webp`,
   },
   {
      title: `Các phụ kiện ngành nail giúp móng tay trở nên lung linh`,
      description: `Danh sách các dụng cụ làm nail cơ bản Móng giả: đây là vật dụ`,
      img: `section/6-2.webp`,
   },
   {
      title: `Bí quyết chăm sóc móng với trọn bộ dụng cụ làm nail`,
      description: `Danh sách các dụng cụ làm nail cơ bản Móng giả: đây là vật dụ`,
      img: `section/6-3.webp`,
   },
];

export default function Blog() {
   const isMobile = useIsMobile();
   return (
      <section id="blog">
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
                     Tin tức
                  </Text>
               </Center>

               {isMobile ? <BlogCarousel listBlog={listBlog} /> : <BlogList listBlog={listBlog} />}
            </Stack>
         </Container>
      </section>
   );
}
