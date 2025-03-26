"use client";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { Group, Menu, Text } from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";

export default function SwitchLangV2() {
   const t = useTranslations("localeSwitcher");
   const locale = useLocale();

   const handleLanguageChange = (localeSelect: Locale): void => {
      if (locale === localeSelect) return;
      setUserLocale(localeSelect);
   };

   return (
      <Menu shadow="md" width={110}>
         <Menu.Target>
            <Group gap={2} style={{ cursor: `pointer` }}>
               <IconWorld stroke={1} size={20} color="white" />
               <Text style={{ color: `white`, fontSize: `14px` }}>{t(locale)}</Text>
            </Group>
         </Menu.Target>
         <Menu.Dropdown>
            <Menu.Item
               onClick={() => {
                  handleLanguageChange("vi");
               }}
            >
               {t(`vi`)}
            </Menu.Item>
            <Menu.Item
               onClick={() => {
                  handleLanguageChange("en");
               }}
            >
               {t(`en`)}
            </Menu.Item>
         </Menu.Dropdown>
      </Menu>
   );
}
