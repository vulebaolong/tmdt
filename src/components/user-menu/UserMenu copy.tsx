import ROUTER_CLIENT, { ROUTER_ADMIN } from "@/constant/router.constant";
import { effectText } from "@/helpers/motion.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Button, Center, Group, Stack, Text } from "@mantine/core";
import { IconDiamond, IconSettings, IconUserCheck, IconUserSearch } from "@tabler/icons-react";
import { toast } from "react-toastify";

// const menuUser = [{ label: "History payment", icon: <IconUserCheck size={14} />, href: ROUTER_CLIENT.TRANSACTION }];

type TProps = {
   textAlign?: "center" | "left" | "right";
};

export default function UserMenu({ textAlign = "center" }: TProps) {
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();

   return (
      <Center>
         <Stack maw={300} w={`100%`}>
            <Group gap={0} wrap="nowrap" justify={textAlign}>
               <Text style={{ width: `40px`, flexShrink: `0` }} c="dimmed" size="xs" component="div">
                  {effectText(`Name`)}
               </Text>
               <Text component="span" size="xs" truncate="end">
                  {info?.fullName}
               </Text>
            </Group>
            <Group gap={0} wrap="nowrap" justify={textAlign}>
               <Text style={{ width: `40px`, flexShrink: `0` }} c="dimmed" size="xs" component="div">
                  {effectText(`Email`)}
               </Text>
               <Text span size="xs" truncate="end">
                  {info?.email}
               </Text>
            </Group>

            <Stack gap={0}>
               {info?.role === 0 && (
                  <Button
                     onClick={() => {
                        router.push(ROUTER_ADMIN.DASHBOARD);
                     }}
                     variant="subtle"
                     color="gray"
                     leftSection={<IconDiamond size={14} />}
                     styles={{ inner: { justifyContent: `start` } }}
                  >
                     Admin
                  </Button>
               )}
               <Button
                  onClick={() => {
                     router.push(ROUTER_CLIENT.TRANSACTION);
                  }}
                  variant="subtle"
                  color="gray"
                  leftSection={<IconUserCheck size={14} />}
                  styles={{ inner: { justifyContent: `start` } }}
               >
                  History payment
               </Button>

               <Button
                  onClick={() => {
                     // router.push(ROUTER_CLIENT.PROFILE);
                     toast.warning(`Coming Soon`);
                  }}
                  variant="subtle"
                  color="gray"
                  leftSection={<IconUserSearch size={14} />}
                  styles={{ inner: { justifyContent: `start` } }}
               >
                  Profile
               </Button>
               <Button
                  onClick={() => {
                     // router.push(ROUTER_CLIENT.SETTING);
                     toast.warning(`Coming Soon`);
                  }}
                  variant="subtle"
                  color="gray"
                  leftSection={<IconSettings size={14} />}
                  styles={{ inner: { justifyContent: `start` } }}
               >
                  Setting
               </Button>
            </Stack>
         </Stack>
      </Center>
   );
}
