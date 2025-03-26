import { Container, createTheme, CSSVariablesResolver } from "@mantine/core";

export const themeOverride = createTheme({
   // defaultRadius: `0px`,
   fontFamily: "Andika, sans-serif",
   fontFamilyMonospace: "Andika, sans-serif",

   // ✅ 1. Khai báo màu custom (phải có 10 mức độ sáng)
   colors: {
      shopee: ["#fff0ec", "#ffdcd2", "#ffb1a3", "#ff8a77", "#ff634a", "#ee4d2d", "#ee4d2d", "#a3311e", "#7d2316", "#57140e"],
   },

   // ✅ 2. Đặt màu mặc định là "shopee"
   primaryColor: "shopee",

   components: {
      Container: Container.extend({
         vars: (_, { size, fluid }) => {
            return {
               root: {
                  "--container-size": fluid ? `100%` : `var(--container-size-${size ? size : `md`})`,
               },
            };
         },
      }),
      Button: {
         defaultProps: {
            radius: "md",
         },
      },
   },
});

export const resolver: CSSVariablesResolver = () => ({
   variables: {},
   light: {},
   dark: {},
});
