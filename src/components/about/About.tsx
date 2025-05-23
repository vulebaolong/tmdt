"use client";

import { Box, Container, Stack, Text } from "@mantine/core";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { descriptionSx, hoverColor5, titleSx } from "../provider/mantine/sx/text.sx";

export default function About() {
   return (
      <Container
         sx={{
            position: `relative`,
            "&:before": {
               content: '""',
               backgroundImage: ` url(/section/2.webp)`,
               width: `205px`,
               height: `436px`,
               backgroundRepeat: `no-repeat`,
               display: `block`,
               position: `absolute`,
               right: 0,
               top: 0,
               transform: `translate(20%, -20%)`,
            },
         }}
      >
         <Box
            sx={{
               display: `grid`,
               gridTemplateColumns: `0.4fr 0.6fr`,
               gap: 20,
            }}
         >
            <Box w={`100%`}>
               <ImageCustom src={`/section/1.webp`} alt="" />
            </Box>
            <Stack>
               <Box>
                  <Text sx={titleSx}>Tina Nail</Text>
                  <Text sx={descriptionSx}>Góc thôn quen để tụ tập</Text>
               </Box>
               <Text sx={descriptionSx}>
                  Tĩnh lặng và dịu sâu - đó là cảm giác đầu tiên khi khẽ mở cánh cửa gỗ nâu quen thuộc Calming spa muốn mang đến cho khách hàng -
                  những người bạn của mình. Giữa trung tâm Sài Gòn náo nhiệt, Tina khép mình ẩn náu trong một không gian kín đáo, dịu dàng. Nơi sẽ
                  ngay lập tức như đưa bạn trở về nhà, như lạc về một miền kí ức thân thương của những nồi nước lá xông thơm phức đến từng ngón tay,
                  sợi tóc. Để cảm xúc được nâng niu, chiều chuộng sau một ngày dài mệt mỏi… Tina Nail - đúng như tên gọi, theo đuổi tiêu chí làm
                  đẹp...
               </Text>

               <Text
                  sx={(theme, u) => {
                     return {
                        ...descriptionSx(theme, u),
                        ...hoverColor5(theme,u),
                     };
                  }}
               >
                  Tìm hiểu thêm
               </Text>
            </Stack>
         </Box>
      </Container>
   );
}
