import { Box, Stack, Text } from "@mantine/core";
import { hoverColor } from "../provider/mantine/sx/text.sx";

type TProps = {
   blog: {
      title: string;
      description: string;
      img: string;
   };
};

export default function BlogItem({ blog }: TProps) {
   return (
      <Box
         sx={{
            backgroundImage: `url(${blog.img})`,
            backgroundSize: `cover`,
            backgroundPosition: `center`,
            height: `550px`,
            borderRadius: `20px`,
            overflow: `hidden`,
            padding: `20px 20px 50px`,
            position: `relative`,
            "&::before": {
               content: '""',
               height: `100%`,
               width: `100%`,
               position: `absolute`,
               top: 0,
               left: 0,
               zIndex: 1,
               background: `linear-gradient(180deg, rgb(113 64 37 / 4%) 0%, rgb(99 76 62) 100%, rgb(79 67 51) 100%)`,
            },
         }}
      >
         <Stack sx={{ height: `100%`, justifyContent: `end`, alignItems: `center`, position: `relative`, zIndex: 2 }}>
            <Text
               lineClamp={2}
               sx={(theme, u) => {
                  return {
                     ...hoverColor(theme, u, theme.colors.spaTheme[6]),
                     color: `white`,
                     fontSize: 24,
                     fontWeight: 700,
                     lineHeight: `32px`,
                     textAlign: `center`,
                  };
               }}
            >
               {blog.title}
            </Text>
            <Text
               lineClamp={2}
               sx={{
                  color: `white`,
                  fontSize: 18,
                  lineHeight: `27px`,
                  textAlign: `center`,
               }}
            >
               {blog.title}
            </Text>
            <Text
               sx={(theme, u) => {
                  return {
                     ...hoverColor(theme, u, theme.colors.spaTheme[6]),
                     color: `white`,
                     fontSize: 18,
                     lineHeight: `27px`,
                  };
               }}
            >
               Tìm hiểu thêm
            </Text>
         </Stack>
      </Box>
   );
}
