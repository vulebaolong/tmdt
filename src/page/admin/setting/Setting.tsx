"use client";

import ProductUploadImage from "@/components/product/product-upload-image/ProductUploadImage";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { useUploadLogo } from "@/tantask/setting.tanstack";
import { Box, Button, Paper, Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function Setting() {
   const [preview, setPreview] = useState<File | null>(null);
   const toast = useAppToast();

   const uploadLogo = useUploadLogo();
   
   const handleUploadLogo = () => {
      if (preview instanceof File) {
         uploadLogo.mutate(preview);
      } else {
         toast.error("Upload logo failed");
      }
   };
   return (
      <Box p={20}>
         <Paper shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }}>
            <Stack>
               <Title size={`h3`}>Logo</Title>
               <ProductUploadImage value={preview} onChange={setPreview} />
               <Button loading={uploadLogo.isPending} onClick={handleUploadLogo} variant="filled">
                  Save
               </Button>
            </Stack>
         </Paper>
      </Box>
   );
}
