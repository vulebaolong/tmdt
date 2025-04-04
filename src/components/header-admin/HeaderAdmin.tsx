"use client";

import { Burger, Center } from "@mantine/core";
import ButtonToggleTheme from "../toggle-theme/button/ButtonToggleTheme";
import classes from "./HeaderAdmin.module.css";
import { useDisclosure } from "@mantine/hooks";
import { MOBILE_VISIBLE_DESKTOP_HIDDEN } from "@/constant/app.constant";
import { LogoIcon } from "../logo/LogoIcon";

function HeaderAdmin() {
   const [opened, { toggle }] = useDisclosure();

   return (
      <header className={`${classes[`box-1`]}`}>
         <Burger size="sm" opened={opened} onClick={toggle} aria-label="Toggle navigation" className={MOBILE_VISIBLE_DESKTOP_HIDDEN} />
         <Center className={`${classes[`box-2`]}`}>
            <LogoIcon />
         </Center>
         <ButtonToggleTheme variant="default" />
      </header>
   );
}

export default HeaderAdmin;
