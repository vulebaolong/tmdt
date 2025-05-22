import { MantineTheme } from "@mantine/core";
import { CSSObject } from "@mantine/emotion";

export const titleSx = (theme: MantineTheme) => {
   return {
      fontSize: 50,
      fontWeight: 700,
      fontFamily: "Great Vibes, cursive",
      color: theme.colors.spaTheme[5],
      lineHeight: 1,
   };
};

export const descriptionSx: CSSObject = { fontSize: 16, fw: 400, color: `#5d6567`, textAlign: `justify` };

export const hoverColor5 = (theme: MantineTheme) => {
   return {
      cursor: "pointer",
      transition: "color 150ms ease",
      "&:hover": {
         color: theme.colors.spaTheme[5],
      },
   };
};
