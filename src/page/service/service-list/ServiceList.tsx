"use client";

import ProductImage from "@/components/product/product-image/ProductImage";
import TextBack from "@/components/text-back/TextBack";
import { useServices } from "@/tantask/service.tanstack";
import { Box, Container, Paper, Stack, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import classes from "./ServiceList.module.css";

export default function ServiceList() {
   const searchParams = useSearchParams();
   const category = searchParams.get("category");
   const [pagination] = useState({ pageIndex: 0, pageSize: 10 });

   const services = useServices({ pagination: { pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize }, filters: { category } });

   console.log({ services: services.data });
   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />
            <Box className={`${classes[`box-container`]}`}>
               {services.data?.items.map((service, i) => {
                  console.log(123);
                  return (
                     <Stack key={i} className={`${classes[`box-item`]}`}>
                        <Paper shadow="sm" radius={15} withBorder p="sm" w={`min-content`}>
                           <ProductImage width="200px" src={service.thumbnail} />
                        </Paper>
                        <Text ta={`center`}>{service.title}</Text>
                     </Stack>
                  );
               })}
            </Box>
         </Stack>
      </Container>
   );
}
