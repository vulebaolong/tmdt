import { Button, Center, Group, Modal, Stack, Text } from "@mantine/core";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";

type TProps = {
   title?: React.ReactNode;
   opened: boolean;
   close: () => void;
   onSuccess?: (e: any) => void;
   id?: any;
   mutationDelete: () => UseMutationResult<any, Error, any, unknown>;
};

export default function ModalConfirmAction({ opened, close, onSuccess, mutationDelete, title = `Are you sure you want to delete?`, id }: TProps) {
   const deletee = mutationDelete();

   const handleCancel = () => {
      close();
   };

   const handleSubmit = () => {
      deletee.mutate(id, {
         onSuccess: (e) => {
            if (onSuccess) onSuccess(e);
         },
      });
   };

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
            <Text ta={`center`} size="lg" fw={`bold`}>
               {title}
            </Text>
            <Center>
               <Group>
                  <Button onClick={handleCancel} variant="outline" disabled={deletee.isPending} mr={10}>
                     Cancel
                  </Button>
                  <Button loading={deletee.isPending} onClick={handleSubmit}>
                     Submit
                  </Button>
               </Group>
            </Center>
         </Stack>
      </Modal>
   );
}
