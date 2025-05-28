import { Logo2 } from "@/components/logo2/Logo2";
import UserControl2 from "@/components/user-control2/UserControl2";
import { MOBILE_HIDDEN_DESKTOP_VISIBLE } from "@/constant/app.constant";
import { breakpoint } from "@/layouts/admin-layout/AdminLayout";
import { Box, Burger, Group } from "@mantine/core";

type TProps = {
   mobileOpened: boolean;
   desktopOpened: boolean;
   toggleMobile: () => void;
   toggleDesktop: () => void;
};

export default function HeaderAdmin({ mobileOpened, desktopOpened, toggleMobile, toggleDesktop }: TProps) {
   return (
      <Group h="100%" px="md" justify="space-between">
         <Group h="100%">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom={breakpoint} size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom={breakpoint} size="sm" />
            <Logo2 width={40} />
         </Group>
         <Box className={`${MOBILE_HIDDEN_DESKTOP_VISIBLE}`}>
            <UserControl2 />
         </Box>
      </Group>
   );
}
