import { Container, createTheme, CSSVariablesResolver } from "@mantine/core";

export const themeOverride = createTheme({
   primaryColor: "spaTheme",
   fontFamily: "Quicksand, sans-serif",
   fontFamilyMonospace: "Quicksand, sans-serif",

   // Khai báo màu custom (phải có 10 mức độ sáng)
   colors: {
      shopee: ["#fff0ec", "#ffdcd2", "#ffb1a3", "#ff8a77", "#ff634a", "#ee4d2d", "#ee4d2d", "#a3311e", "#7d2316", "#57140e"],
      NailaturePink: [
         "#fffafa", // 0 - very light background
         "#ffeaea", // 1
         "#ffd6dd", // 2
         "#fcbecf", // 3
         "#f49cb4", // 4
         "#e57896", // 5 - primary shade
         "#d05a7b", // 6
         "#b54564", // 7
         "#93314e", // 8
         "#6a1f38", // 9 - darkest
      ],

      // Be nhạt / kem – nền sáng
      NailatureBeige: [
         "#fdfcfa", // 0
         "#faf7f4", // 1
         "#f4efea", // 2
         "#eee6df", // 3
         "#e2d6cb", // 4
         "#d4c4b4", // 5
         "#bfa894", // 6
         "#9e8674", // 7
         "#7e6858", // 8
         "#5a483c", // 9
      ],

      // Nâu đỏ nhấn – dùng cho text, nút quan trọng
      NailatureBrown: [
         "#fef8f7", // 0
         "#fceae7", // 1
         "#f3c8c2", // 2
         "#e5a9a0", // 3
         "#d68179", // 4
         "#c35d59", // 5 - accent
         "#9e3e3c", // 6
         "#772d2b", // 7
         "#521f1e", // 8
         "#341414", // 9
      ],

      // Vàng ánh kim nhẹ (trang trí)
      NailatureGold: [
         "#fffcf5", // 0
         "#fff5d7", // 1
         "#ffe7a3", // 2
         "#ffd770", // 3
         "#ffc63f", // 4
         "#f5b200", // 5 - gold accent
         "#c49100", // 6
         "#997200", // 7
         "#715500", // 8
         "#4a3900", // 9
      ],

      spaTheme: [
         "#fefaf7", // 0 – Rất nhạt, nền
         "#fbeee7", // 1 – Nhạt hơn, nền mờ
         "#f5dbcd", // 2
         "#edc6b2", // 3
         "#e3b296", // 4
         "#daa785", // 5 – Màu chủ đạo
         "#c08f72", // 6
         "#a47660", // 7
         "#855d4c", // 8
         "#664338", // 9 – Đậm, dùng cho nhấn
      ],
   },

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
      Input: {
         defaultProps: {
            radius: "md",
         },
      },
      TextInput: {
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
