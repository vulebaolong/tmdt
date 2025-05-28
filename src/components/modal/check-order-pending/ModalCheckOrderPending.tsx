import { ActionIcon, Button, Center, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React from "react";

type TProps = {
   title: React.ReactNode;
   opened: boolean;
   close: () => void;
   onSubmit: () => void;
   onCancel: () => void;
};

export default function ModalCheckOrderPending({ opened, close, title, onSubmit, onCancel }: TProps) {
   const theme = useMantineTheme();

   return (
      <Modal
         opened={opened}
         centered
         onClose={close}
         withCloseButton={false}
         styles={{ content: { borderRadius: `15px` } }}
         overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
         }}
      >
         <Stack>
            <Text ta={`center`} size="xl" fw={`bold`}>
               {title}
            </Text>
            <Center>
               <Text maw={270} style={{ cursor: `pointer`, textAlign: `center` }}>
                  Hiện tại hệ thống chỉ hỗ trợ một đơn hàng <span style={{ fontWeight: `bold` }}>đang chờ thanh toán</span> cùng lúc
               </Text>
            </Center>
            <Center>
               <Button onClick={onSubmit} color={theme.colors.spaTheme[5]}>
                  Đi đến đơn hàng
               </Button>
            </Center>
            <Center>
               <ActionIcon onClick={onCancel} variant="subtle" radius="xl" aria-label="Settings">
                  <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
               </ActionIcon>
            </Center>
         </Stack>
      </Modal>
   );
}
