import { MantineTheme } from "@mantine/core";
import { EmotionHelpers } from "@mantine/emotion";

type TEmotionSxFunction = (theme: MantineTheme, u: EmotionHelpers) => any;

export const titleSx: TEmotionSxFunction = (theme: MantineTheme) => {
   return {
      fontSize: 50,
      fontWeight: 700,
      fontFamily: "Great Vibes, cursive",
      color: theme.colors.spaTheme[5],
      lineHeight: 1,
   };
};


export const descriptionSx: TEmotionSxFunction = (_: MantineTheme, u: EmotionHelpers) => {
   return {
      fontSize: 16,
      fw: 400,
      [u.light]: { color: "#5d6567" },
      [u.dark]: { color: `white` },
      textAlign: `justify`,
   };
};

export const hoverColor5: TEmotionSxFunction = (theme: MantineTheme) => {
   return {
      cursor: "pointer",
      transition: "color 150ms ease",
      "&:hover": {
         color: theme.colors.spaTheme[5],
      },
   };
};
