import { Box } from "@mantine/core";
import { ReactNode } from "react";

type PhoneLinkProps = {
   phone: string;
   children?: ReactNode;
   color?: string; // optional: custom hover color
   hoverEffect?: boolean;
};

export default function PhoneLink({ phone, children, color, hoverEffect = true }: PhoneLinkProps) {
   return (
      <Box
         component="a"
         onClick={() => window.open(`tel:${phone}`)}
         sx={(theme) => ({
            cursor: "pointer",
            color: "inherit",
            textDecoration: "none",
            ...(hoverEffect && {
               transition: "color 0.2s ease",
               "&:hover": {
                  color: color || theme.colors.spaTheme?.[5] || theme.primaryColor,
               },
            }),
         })}
      >
         {children || phone}
      </Box>
   );
}
