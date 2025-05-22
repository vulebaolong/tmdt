import { Title as MantineTitle, TitleProps as MantineTitleProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ReactNode, forwardRef } from "react";

interface CustomTitleProps extends MantineTitleProps {
   children: ReactNode;
}

const Title = forwardRef<HTMLDivElement, CustomTitleProps>(({ children, ...props }, ref) => {
   const t = useTranslations();

   return (
      <MantineTitle ref={ref} {...props}>
         {typeof children === "string" ? t(children) : children}
      </MantineTitle>
   );
});

Title.displayName = "Title";

export default Title;
