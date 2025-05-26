"use client";

import ROUTER_CLIENT from "@/constant/router.constant";
import { logout } from "@/helpers/api.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Group, Menu, Stack, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import UserAction from "../user-action/UserAction";
import UserMenu from "../user-menu/UserMenu";

type TProps = {
   colorText?: string;
};

export default function UserControl2( { colorText = "black" }: TProps ) {
   const t = useTranslations();
   const router = useRouter();
   const info = useAppSelector((state) => state.user.info);

   return (
      <Menu shadow="md" width={200}>
         <Menu.Target>
            <Group
               gap={2}
               sx={(theme, u) => ({
                  cursor: "pointer",
                  transition: "color 150ms ease",
                  [u.light]: {
                     color: colorText,
                  },
                  [u.dark]: {
                     color: "white",
                  },
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
               <Stack p={5}>
                  <UserMenu textAlign="left" />

                  <Menu.Divider />

                  <UserAction textAlign="left" />
               </Stack>
            </Menu.Dropdown>
         ) : (
            <Menu.Dropdown>
               <Stack p={5}>
                  <Menu.Item onClick={() => router.push(ROUTER_CLIENT.LOGIN)}>{t(`Login`)}</Menu.Item>
                  <Menu.Item onClick={logout}>{t(`Register`)}</Menu.Item>
               </Stack>
            </Menu.Dropdown>
         )}
      </Menu>
   );
}
