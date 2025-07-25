"use client";

import ROUTER_CLIENT, { ROUTER_ADMIN } from "@/constant/router.constant";
import { logout } from "@/helpers/api.helper";
import { effectText } from "@/helpers/motion.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Avatar, Group, Menu, Text } from "@mantine/core";
import { IconDiamond, IconLogout, IconSettings, IconUserCheck, IconUserSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAppToast } from "../provider/toast/Toasti18n";
import classes from "./UserControl.module.css";

export default function UserControl() {
   const t = useTranslations();
   const toast = useAppToast();
   const router = useRouter();
   const info = useAppSelector((state) => state.user.info);

   return (
      <Menu shadow="md" width={200}>
         <Menu.Target>{<Avatar color="white" style={{ cursor: `pointer` }} variant="transparent" radius="sm" />}</Menu.Target>

         <Menu.Dropdown>
            <Group gap={0} className={classes.textAvatar} wrap="nowrap">
               <Text className={classes.widthText} c="dimmed" size="xs" component="div">
                  {effectText(`Name`)}
               </Text>
               <Text component="span" size="xs" truncate="end">
                  {info?.fullName}
               </Text>
            </Group>
            <Group gap={0} className={classes.textAvatar} wrap="nowrap">
               <Text className={classes.widthText} c="dimmed" size="xs" component="div">
                  {effectText(`Email`)}
               </Text>
               <Text span size="xs" truncate="end">
                  {info?.email}
               </Text>
            </Group>

            <Menu.Divider />

            <Menu.Label>{t(`Application`)}</Menu.Label>

            {info?.role === 0 && (
               <Menu.Item
                  onClick={() => {
                     router.push(ROUTER_ADMIN.DASHBOARD);
                  }}
                  leftSection={<IconDiamond size={14} />}
               >
                  {t(`Admin`)}
               </Menu.Item>
            )}

            <Menu.Item
               onClick={() => {
                  router.push(ROUTER_CLIENT.TRANSACTION);
               }}
               leftSection={<IconUserCheck size={14} />}
            >
               {t(`History payment`)}
            </Menu.Item>

            <Menu.Item
               onClick={() => {
                  // router.push(ROUTER_CLIENT.PROFILE);
                  toast.warning(`Coming Soon`);
               }}
               leftSection={<IconUserSearch size={14} />}
            >
               {t(`Profile`)}
            </Menu.Item>

            <Menu.Item
               onClick={() => {
                  // router.push(ROUTER_CLIENT.SETTING);
                  toast.warning(`Coming Soon`);
               }}
               leftSection={<IconSettings size={14} />}
            >
               {t(`Setting`)}
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item onClick={logout} color="red" leftSection={<IconLogout size={14} />}>
               {t(`Logout`)}
            </Menu.Item>
         </Menu.Dropdown>
      </Menu>
   );
}
