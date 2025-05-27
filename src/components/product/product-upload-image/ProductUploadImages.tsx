"use client";

import { BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ActionIcon, Avatar, Box, Group, Paper, Text, rem } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type ImageValue = string | File;

type Props = {
   value: ImageValue[];
   onChange: (files: ImageValue[]) => void;
   error?: string;
};

export default function ProductUploadImages({ value, onChange, error }: Props) {
   const [previews, setPreviews] = useState<string[]>([]);

   useEffect(() => {
      const next = value.map((v) => (typeof v === "string" ? `${BASE_DOMAIN_CLOUDINARY}${v}` : URL.createObjectURL(v)));
      setPreviews(next);
   }, [value]);

   const handleRemove = (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
   };

   return (
      <Paper shadow="md" radius="lg" withBorder>
         <Dropzone
            onDrop={(files) => {
               onChange([...value, ...files]);
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={1 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            multiple
         >
            <Group p={20} justify="center" gap="xl" mih={180}>
               <Dropzone.Accept>
                  <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
               </Dropzone.Accept>
               <Dropzone.Reject>
                  <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
               </Dropzone.Reject>
               <Dropzone.Idle>
                  <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
               </Dropzone.Idle>

               <div>
                  <Text ta="center" size="md" inline>
                     Drag images here or click to select
                  </Text>
                  <Text ta="center" size="sm" c="dimmed" inline mt={7}>
                     You can upload multiple images. Max 5MB per file.
                  </Text>
                  {error && (
                     <Text ta="center" c="red" mt={5}>
                        {error}
                     </Text>
                  )}
               </div>
            </Group>
         </Dropzone>

         {previews.length > 0 && (
            <Group mt="sm" wrap="wrap" gap="sm" px="md" pb="md">
               {previews.map((src, i) => (
                  <Box key={i} pos="relative">
                     <Avatar src={src} size={80} radius="md" />
                     <ActionIcon
                        color="red"
                        radius="xl"
                        variant="filled"
                        size="sm"
                        pos="absolute"
                        top={-5}
                        right={-5}
                        onClick={() => handleRemove(i)}
                     >
                        <IconTrash size={14} />
                     </ActionIcon>
                  </Box>
               ))}
            </Group>
         )}
      </Paper>
   );
}
