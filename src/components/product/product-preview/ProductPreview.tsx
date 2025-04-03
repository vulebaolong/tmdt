import { useImagePreview } from "@/hooks/image-preview.hook";
import { Box, Center, Paper } from "@mantine/core";
import { FormikProps } from "formik";
import ProductItem from "../product-item/ProductItem";

export default function ProductPreview({ createForm }: { createForm: FormikProps<any> }) {
   const file = createForm.values.imagePublicId;
   const preView = useImagePreview(file);

   console.log();

   return (
      <Paper shadow="md" radius="lg" withBorder p="xl">
         <Center h={`100%`}>
            <Box w={215}>
               <ProductItem
                  type="review"
                  preview={preView}
                  product={
                     {
                        imagePublicId: createForm.values.imagePublicId,
                        name: createForm.values.name,
                        tags: [],
                        price: createForm.values.price,
                     } as any
                  }
               />
            </Box>
         </Center>
      </Paper>
   );
}
