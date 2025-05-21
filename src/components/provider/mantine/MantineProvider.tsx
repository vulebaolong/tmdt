import { RootStyleRegistry } from "@/components/provider/mantine/EmotionRootStyleRegistry";
import { MantineProvider as MantineProviderRoot } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { ReactNode } from "react";
import { themeOverride } from "./theme";

export default function MantineProvider({ children }: { children: ReactNode }) {
   return (
      <RootStyleRegistry>
         <MantineEmotionProvider>
            {/* <MantineProviderRoot theme={themeOverride} stylesTransform={emotionTransform} defaultColorScheme="dark" cssVariablesResolver={resolver}> */}
            <MantineProviderRoot theme={themeOverride} stylesTransform={emotionTransform} defaultColorScheme="dark">
               {children}
            </MantineProviderRoot>
         </MantineEmotionProvider>
      </RootStyleRegistry>
   );
}
