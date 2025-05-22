"use client";

import Nodata from "@/components/no-data/Nodata";
import ProductImage from "@/components/product/product-image/ProductImage";
import TextBack from "@/components/text-back/TextBack";
import Text from "@/components/custom/text-custom/TextCustom";
import ROUTER from "@/constant/router.constant";
import { IService } from "@/schemas/service.schema";
import { useGetServiceList } from "@/tantask/service.tanstack";
import { EServiceCategory } from "@/types/enum/service.enum";
import { Box, Button, Center, Container, Paper, Stack, Tabs, Text as TextMantine, useMantineTheme } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classes from "./ServiceList.module.css";

export default function ServiceList() {
   const theme = useMantineTheme();
   const searchParams = useSearchParams();
   const categoryQuery = searchParams.get("category");
   const [category, setCategory] = useState<string | null>(categoryQuery || "0");
   const [services, setServices] = useState<IService[]>([]);
   const router = useRouter();
   const t = useTranslations();
   const totalPage = useRef(0);
   const [page, setPage] = useState(1);

   const getServiceList = useGetServiceList();

   useEffect(() => {
      if (category === null) return;
      getServiceList.mutate(
         { page: 1, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.pageCount;
               setServices(data.items);
            },
         }
      );
   }, [category]);

   useEffect(() => {
      if (category === null) return;

      if (page < 2 || page > totalPage.current) return;
      getServiceList.mutate(
         { page, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.pageCount;
               const newProducts = [...services, ...data.items];
               setServices(newProducts);
            },
         }
      );
   }, [page]);

   const handleLoadMore = () => {
      setPage((prev) => {
         return prev + 1;
      });
   };

   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Tabs value={category} onChange={setCategory} variant="outline" radius="md" defaultValue="gallery">
               <Tabs.List>
                  {Object.keys(EServiceCategory)
                     .filter((key) => !isNaN(Number(key)))
                     .map((key) => {
                        return (
                           <Tabs.Tab key={key} value={key}>
                              <Text
                                 style={{ lineHeight: 1, fontSize: 14, fontWeight: category === key ? `bold` : `normal` }}
                                 c={category === key ? theme.colors.shopee[5] : undefined}
                              >
                                 {EServiceCategory[Number(key)]}
                              </Text>
                           </Tabs.Tab>
                        );
                     })}
               </Tabs.List>
            </Tabs>
            <Box className={`${classes[`box-container`]}`} mih={300}>
               {services.map((service, i) => {
                  return (
                     <Stack
                        key={i}
                        style={{
                           cursor: `pointer`,
                           width: `min-content`,
                           opacity: "0",
                           animation: "fadeInUp 0.5s forwards",
                           animationDelay: `${50 * i}ms`,
                        }}
                        onClick={() => {
                           router.push(`${ROUTER.SERVICE}/${service._id}`);
                        }}
                     >
                        <Paper shadow="sm" radius={15} withBorder p="sm" w={`min-content`}>
                           <ProductImage borderRadius={`10px`} width="200px" src={service.thumbnail} />
                        </Paper>
                        <TextMantine ta={`center`}>{service.title}</TextMantine>
                     </Stack>
                  );
               })}
            </Box>
            {services.length > 0 ? (
               <Center>
                  <Button loading={getServiceList.isPending} disabled={page === totalPage.current} onClick={handleLoadMore} variant="default" w={300}>
                     {t(`See more`)}
                  </Button>
               </Center>
            ) : (
               <Center w={`100%`}>
                  <Nodata />
               </Center>
            )}
         </Stack>
      </Container>
   );
}
