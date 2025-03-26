"use client";

import classes from "./ProductMore.module.css";
import { Box, Button, Center, Stack } from "@mantine/core";
import ProductItem from "../product-item/ProductItem";

export default function ProductMore() {
   return (
      <Stack>
         <Box className={`${classes[`box-container`]}`}>
            {[].map((product, i) => {
               return <ProductItem key={i} product={product} />;
            })}
         </Box>
         <Center>
            <Button variant="default" w={300}>
               Xem Thêm
            </Button>
         </Center>
      </Stack>
   );
}
