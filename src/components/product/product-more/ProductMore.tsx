"use client";

import classes from "./ProductMore.module.css";
import { Box, Button, Center, Stack } from "@mantine/core";
import ProductItem from "../product-item/ProductItem";
import { useTranslations } from "next-intl";

export default function ProductMore() {
   const t = useTranslations()
   return (
      <Stack>
         <Box className={`${classes[`box-container`]}`}>
            {[].map((product, i) => {
               return <ProductItem key={i} product={product} />;
            })}
         </Box>
         <Center>
            <Button variant="default" w={300}>
               {t(`Xem Thêm`)}
            </Button>
         </Center>
      </Stack>
   );
}
