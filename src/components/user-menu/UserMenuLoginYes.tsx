import ROUTER_CLIENT, { ROUTER_ADMIN } from "@/constant/router.constant";
import { logout } from "@/helpers/api.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Avatar, Divider, Group, Stack, Text } from "@mantine/core";
import { IconCrown, IconLogout, IconSettings, IconUserCheck, IconUserSearch } from "@tabler/icons-react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import UserMenuItem from "./UserMenuItem";

const listMenu = [
   {
      label: "Admin",
      icon: <IconCrown size={16} />,
      href: ROUTER_ADMIN.DASHBOARD,
   },
   {
      label: "History payment",
      icon: <IconUserCheck size={16} />,
      href: ROUTER_CLIENT.TRANSACTION,
   },
   {
      label: "Profile",
      icon: <IconUserSearch size={16} />,
      href: null,
   },
   {
      label: "Setting",
      icon: <IconSettings size={16} />,
      href: ROUTER_CLIENT.SETTING,
   },
   {
      label: "Logout",
      icon: <IconLogout size={16} />,
      href: null,
   },
];

export default function UserMenuLoginYes() {
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();

   return (
      <Stack>
         <Group
            sx={{
               flexWrap: `nowrap`,
               padding: `5px 10px`,
               width: `100%`,
               borderRadius: `10px`,
               "&:hover": { backgroundColor: `var(--mantine-color-gray-light-hover)` },
               cursor: `pointer`,
               transition: `background-color 0.2s ease`,
               gap: 10,
            }}
         >
            <Avatar size={`md`} name={info?.fullName} color="initials" />
            <Stack gap={0}>
               <Text truncate sx={{ fontWeight: 900, fontSize: `16px`, maxWidth: `130px` }}>
                  {info?.fullName}
               </Text>
               <Text truncate sx={{ maxWidth: `130px`, fontSize: `12px`, opacity: 0.5 }}>
                  {info?.email}
               </Text>
            </Stack>
         </Group>

         <Stack gap={2}>
            {listMenu.map((item, i) => {
               if (item.label === "Admin" && info?.role !== 0) return null;
               return (
                  <Fragment key={i}>
                     <UserMenuItem
                        item={item}
                        onClick={() => {
                           if (i === listMenu.length - 1) {
                              logout();
                              return;
                           }
                           if (item.href) {
                              router.push(item.href);
                           } else {
                              toast.info(`Coming Soon`);
                           }
                        }}
                     />

                     {i + 2 === listMenu.length && <Divider my="xs" />}
                  </Fragment>
               );
            })}
         </Stack>
      </Stack>
   );
}
