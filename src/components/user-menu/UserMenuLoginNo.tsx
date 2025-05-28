import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { Stack } from "@mantine/core";
import { IconLogin, IconUserEdit } from "@tabler/icons-react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { toast } from "react-toastify";
import UserMenuItem from "./UserMenuItem";

const listMenu = [
   {
      label: "Đăng nhập",
      icon: <IconLogin size={16} />,
      href: ROUTER_CLIENT.LOGIN,
   },
   {
      label: "Đăng ký",
      icon: <IconUserEdit size={16} />,
      href: ROUTER_CLIENT.REGISTER,
   },
];

type TProps = {
   setOpened: Dispatch<SetStateAction<boolean>>;
};

export default function UserMenuLoginNo({ setOpened }: TProps) {
   const router = useRouter();
   return (
      <Stack gap={2}>
         {listMenu.map((item, i) => {
            return (
               <Fragment key={i}>
                  <UserMenuItem
                     item={item}
                     onClick={() => {
                        if (item.href) {
                           router.push(item.href);
                        } else {
                           toast.info(`Coming Soon`);
                        }
                        setOpened(false);
                     }}
                  />
               </Fragment>
            );
         })}
      </Stack>
   );
}
