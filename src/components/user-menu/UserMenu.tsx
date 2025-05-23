import ROUTER_CLIENT from "@/constant/router.constant";
import { effectText } from "@/helpers/motion.helper";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { Button, Center, Group, Stack, Text } from "@mantine/core";
import { IconUserCheck } from "@tabler/icons-react";
import Badge from "../badge/Badge";

const menuUser = [{ label: "History payment", icon: <IconUserCheck size={14} />, href: ROUTER_CLIENT.TRANSACTION }];

type TProps = {
   textAlign?: "center" | "left" | "right";
};

export default function UserMenu({ textAlign = "center" }: TProps) {
   const info = useAppSelector((state) => state.user.info);
   const router = useRouter();

   return (
      <Center>
         <Stack maw={300} w={`100%`}>
            <Center>
               <Badge user={info} w={`100%`} radius={`md`} />
            </Center>

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
               {menuUser.map((item, i) => {
                  return (
                     <Button
                        key={i}
                        onClick={() => {
                           router.push(item.href);
                        }}
                        variant="subtle"
                        color="gray"
                        leftSection={item.icon}
                        styles={{ inner: { justifyContent: `start` } }}
                     >
                        {item.label}
                     </Button>
                  );
               })}
            </Stack>
         </Stack>
      </Center>
   );
}
