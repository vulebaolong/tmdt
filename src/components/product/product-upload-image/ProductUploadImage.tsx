"use client";

import ProductItem from "@/components/product/product-item/ProductItem";
import { Avatar, Box, Center, Group, Paper, rem, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
   value: File | null;
   onChange: (file: File | null) => void;
   error?: string;
};

export default function ProductUploadImage({ value, onChange, error }: Props) {
   const [preview, setPreview] = useState<string | null>(null);

   useEffect(() => {
      if (value) {
         setPreview(URL.createObjectURL(value));
      } else {
         setPreview(null);
      }
   }, [value]);

   return (
      <Stack>
         <Paper shadow="md" radius="lg" withBorder p="xl">
            <Center h={`100%`}>
               <Box w={215}>
                  <ProductItem
                     type="review"
                     product={
                        {
                           images: [preview],
                           name: "Preview",
                           tag: [],
                           price: 0,
                        } as any
                     }
                  />
               </Box>
            </Center>
         </Paper>
         <Paper shadow="md" radius="lg" withBorder>
            <Dropzone
               onDrop={(files) => {
                  if (files[0]) {
                     onChange(files[0]);
                  }
               }}
               onReject={(files) => console.log("rejected files", files)}
               maxSize={5 * 1024 ** 2}
               accept={IMAGE_MIME_TYPE}
            >
               <Group p={20} justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                  <Dropzone.Accept>
                     <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                     <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                     {preview ? (
                        <Avatar src={preview} size={120} />
                     ) : (
                        <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                     )}
                  </Dropzone.Idle>

                  <div>
                     <Text ta={`center`} size="md" inline>
                        Drag images here or click to select files
                     </Text>
                     <Text ta={`center`} size="sm" c="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not exceed 5mb
                     </Text>
                     {error && (
                        <Text ta="center" c="red" mt={5}>
                           {error}
                        </Text>
                     )}
                  </div>
               </Group>
            </Dropzone>
         </Paper>
      </Stack>
   );
}
