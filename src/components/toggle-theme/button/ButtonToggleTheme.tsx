"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ButtonToggleTheme() {
   const { toggleColorScheme } = useMantineColorScheme();

   return (
      <>
         <ActionIcon variant="transparent" onClick={toggleColorScheme} color={`white`} size="md" radius="xl" lightHidden>
            <IconSun stroke={1.5} size={20} />
         </ActionIcon>
         <ActionIcon variant="transparent" onClick={toggleColorScheme} color={`white`} size="md" radius="xl" darkHidden>
            <IconMoon stroke={1.5} size={20} />
         </ActionIcon>
      </>
   );
}
