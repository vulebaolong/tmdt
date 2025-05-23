"use client";

import { MOBILE_HIDDEN_DESKTOP_VISIBLE } from "@/constant/app.constant";
import { ROUTER_ADMIN } from "@/constant/router.constant";
import { Box, NavLink } from "@mantine/core";
import { IconActivity, IconBrandAppleArcade, IconFingerprint, IconGauge, IconSettings } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import classes from "./NavAdmin.module.css";

const data = [
   { icon: IconGauge, label: "Dashboard", description: "Item with description", link: ROUTER_ADMIN.DASHBOARD },
   { icon: IconFingerprint, label: "Product", link: ROUTER_ADMIN.PRODUCT },
   { icon: IconBrandAppleArcade, label: "Service", link: ROUTER_ADMIN.SERVICE },
   { icon: IconSettings, label: "Setting", link: ROUTER_ADMIN.SETTING},
   { icon: IconActivity, label: "User", link: ROUTER_ADMIN.USER },
];

type TProps = {
   setTitle: Dispatch<SetStateAction<string>>;
};

export default function NavAdmin({ setTitle }: TProps) {
   const router = useRouter();
   const pathName = usePathname();

   useEffect(() => {
      const result = data.find((item) => item.link === pathName);
      if (result) setTitle(result.label);
   }, [pathName]);

   return (
      <Box className={`${classes[`box-1`]} ${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}>
         {data.map((item, i) => (
            <NavLink
               key={i}
               active={item.link === pathName}
               label={item.label}
               description={item.description}
               leftSection={<item.icon size={16} stroke={1.5} />}
               onClick={() => {
                  router.push(item.link);
               }}
            />
         ))}
      </Box>
   );
}
