"use client";

import Nodata from "@/components/no-data/Nodata";
import ProductImage from "@/components/product/product-image/ProductImage";
import TextBack from "@/components/text-back/TextBack";
import ROUTER_CLIENT from "@/constant/router.constant";
import { IService } from "@/schemas/service.schema";
import { useGetServiceList } from "@/tantask/service.tanstack";
import { Badge, Box, Button, Center, Container, Group, Loader, Paper, Stack, Text, Text as TextMantine, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classes from "./ServiceList.module.css";

export default function ServiceList() {
   const [services, setServices] = useState<IService[]>([]);
   const router = useRouter();
   const t = useTranslations();
   const totalPage = useRef(0);
   const [page, setPage] = useState(1);

   const getServiceList = useGetServiceList();

   useEffect(() => {
      getServiceList.mutate(
         { page },
         {
            onSuccess: (data) => {
               totalPage.current = data.totalPage;
               setServices((prev) => [...prev, ...data.items]);
            },
         }
      );
   }, [page]);

   const handleLoadMore = () => {
      setPage((prev) => prev + 1);
   };

   const isFirstLoad = getServiceList.isPending && services.length === 0;

   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Stack gap={50}>
               <Box>
                  <Group justify="center">
                     <Badge variant="filled" size="lg">
                        Nail Service
                     </Badge>
                  </Group>

                  <Title
                     order={2}
                     ta="center"
                     mt="sm"
                     sx={{
                        fontWeight: 900,
                        fontSize: `clamp(28px, 4vw, 34px)`,
                     }}
                  >
                     Professional & Relaxing Nail Services
                  </Title>

                  <Text
                     c="dimmed"
                     ta="center"
                     mt="md"
                     sx={{
                        maxWidth: 600,
                        marginLeft: "auto",
                        marginRight: "auto",
                        position: "relative",

                        "&::after": {
                           content: '""',
                           display: "block",
                           backgroundColor: "#daa785",
                           width: 45,
                           height: 2,
                           marginTop: "var(--mantine-spacing-sm)",
                           marginLeft: "auto",
                           marginRight: "auto",
                        },
                     }}
                  >
                     We provide a full range of professional nail services including manicure, pedicure, nail art, and spa treatments. Whether youre
                     looking for a quick polish or a luxurious spa experience, our skilled technicians ensure your nails are beautiful, healthy, and
                     perfectly styled.
                  </Text>
               </Box>

               {isFirstLoad ? (
                  <Center mih={300}>
                     <Loader
                        sx={(theme) => {
                           return {
                              color: theme.colors.spaTheme[5],
                           };
                        }}
                        size="lg"
                     />
                  </Center>
               ) : (
                  <>
                     <Box className={`${classes[`box-container`]}`} mih={300}>
                        {services.map((service, i) => (
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
                                 router.push(`${ROUTER_CLIENT.SERVICE}/${service._id}`);
                              }}
                           >
                              <Paper shadow="sm" radius={15} withBorder p="sm" w={`min-content`}>
                                 <ProductImage borderRadius={`10px`} width="200px" src={service.thumbnail} />
                              </Paper>
                              <TextMantine ta={`center`}>{service.title}</TextMantine>
                           </Stack>
                        ))}
                     </Box>

                     {services.length > 0 && (
                        <Center>
                           <Button
                              loading={getServiceList.isPending}
                              disabled={page === totalPage.current}
                              onClick={handleLoadMore}
                              variant="default"
                              w={300}
                           >
                              {t(`See more`)}
                           </Button>
                        </Center>
                     )}
                  </>
               )}

               {!isFirstLoad && services.length === 0 && (
                  <Center w={`100%`}>
                     <Nodata />
                  </Center>
               )}
            </Stack>
         </Stack>
      </Container>
   );
}
