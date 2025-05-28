import { MOBILE_VISIBLE_DESKTOP_HIDDEN } from "@/constant/app.constant";
import { ROUTER_ADMIN } from "@/constant/router.constant";
import { Box, Divider, NavLink, ScrollArea, Stack } from "@mantine/core";
import { IconActivity, IconBrandAppleArcade, IconFingerprint, IconGauge } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserAction from "../user-action/UserAction";
import UserMenuLoginYes from "../user-menu/UserMenuLoginYes";

const navLinks = [
   {
      label: "Dashboard",
      href: ROUTER_ADMIN.DASHBOARD,
      icon: <IconGauge size={16} stroke={1.5} />,
   },
   {
      label: "Product",
      href: ROUTER_ADMIN.PRODUCT,
      icon: <IconFingerprint size={16} stroke={1.5} />,
   },
   {
      label: "Service",
      href: ROUTER_ADMIN.SERVICE,
      icon: <IconBrandAppleArcade size={16} stroke={1.5} />,
   },
   // {
   //    label: "Setting",
   //    href: ROUTER_ADMIN.SETTING,
   //    icon: <IconSettings size={16} stroke={1.5} />,
   // },
   {
      label: "User",
      href: ROUTER_ADMIN.USER,
      icon: <IconActivity size={16} stroke={1.5} />,
   },
];

type TProps = {
   closeMobile: () => void;
};

export default function NavbarAdmin({ closeMobile }: TProps) {
   const pathname = usePathname();
   return (
      <Stack h={`100%`}>
         <Box className={` ${MOBILE_VISIBLE_DESKTOP_HIDDEN}`}>
            <UserMenuLoginYes onClick={closeMobile} />
         </Box>

         <Divider className={` ${MOBILE_VISIBLE_DESKTOP_HIDDEN}`} />

         <ScrollArea flex={1}>
            {navLinks.map((link) => {
               return (
                  <NavLink
                     style={{ borderRadius: `var(--mantine-radius-md)` }}
                     key={link.href}
                     label={link.label}
                     component={Link}
                     href={link.href}
                     active={pathname.includes(link.href)}
                     leftSection={link.icon}
                     onClick={() => {
                        closeMobile();
                     }}
                  >
                     {undefined}
                  </NavLink>
               );
            })}
         </ScrollArea>
         <UserAction className={` ${MOBILE_VISIBLE_DESKTOP_HIDDEN}`} />
      </Stack>
   );
}
