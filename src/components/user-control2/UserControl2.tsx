"use client";

import ROUTER from "@/constant/router.constant";
import { logout } from "@/helpers/api.helper";
import { effectText } from "@/helpers/motion.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Group, Menu, Text } from "@mantine/core";
import { IconDiamond, IconLogout, IconSettings, IconUser, IconUserCheck, IconUserSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useAppToast } from "../provider/toast/Toasti18n";

export default function UserControl2() {
   const t = useTranslations();
   const toast = useAppToast();
   const router = useRouter();
   const info = useAppSelector((state) => state.user.info);

   return (
      <Menu shadow="md" width={200}>
         <Menu.Target>
            <Group
               gap={2}
               sx={(theme) => ({
                  cursor: "pointer",
                  transition: "color 150ms ease",
                  color: "white",
                  "&:hover": {
                     color: theme.colors[theme.primaryColor][5],
                  },
               })}
            >
               <IconUser size={16} stroke={1} />
               <Text style={{ fontWeight: 400, fontSize: `14px` }}>Tài khoản</Text>
            </Group>
         </Menu.Target>

         {info ? (
            <Menu.Dropdown>
               <Group gap={0} wrap="nowrap">
                  <Text c="dimmed" size="xs" component="div">
                     {effectText(`Name`)}
                  </Text>
                  <Text component="span" size="xs" truncate="end">
                     {info?.fullName}
                  </Text>
               </Group>
               <Group gap={0} wrap="nowrap">
                  <Text c="dimmed" size="xs" component="div">
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
                        router.push(ROUTER.ADMIN.ROOT);
                     }}
                     leftSection={<IconDiamond size={14} />}
                  >
                     {t(`Admin`)}
                  </Menu.Item>
               )}

               <Menu.Item
                  onClick={() => {
                     router.push(ROUTER.TRANSACTION);
                  }}
                  leftSection={<IconUserCheck size={14} />}
               >
                  {t(`History payment`)}
               </Menu.Item>

               <Menu.Item
                  onClick={() => {
                     // router.push(ROUTER.PROFILE);
                     toast.warning(`Coming Soon`);
                  }}
                  leftSection={<IconUserSearch size={14} />}
               >
                  {t(`Profile`)}
               </Menu.Item>

               <Menu.Item
                  onClick={() => {
                     // router.push(ROUTER.SETTING);
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
         ) : (
            <Menu.Dropdown>
               <Menu.Item onClick={() => router.push(ROUTER.LOGIN)}>{t(`Login`)}</Menu.Item>
               <Menu.Item onClick={logout}>{t(`Register`)}</Menu.Item>
            </Menu.Dropdown>
         )}
      </Menu>
   );
}
