import { Text as MantineText, TextProps as MantineTextProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import { DOMAttributes, ReactNode, forwardRef } from "react";

type CustomTextProps = {
   children: ReactNode;
} & MantineTextProps &
   DOMAttributes<any>;

const Text = forwardRef<HTMLDivElement, CustomTextProps>(({ children, ...props }, ref) => {
   const t = useTranslations();

   return (
      <MantineText ref={ref} {...props}>
         {typeof children === "string" ? t(children) : children}
      </MantineText>
   );
});

Text.displayName = "Text";

export default Text;
