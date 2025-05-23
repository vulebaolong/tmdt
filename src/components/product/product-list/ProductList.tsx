"use client";

import Nodata from "@/components/no-data/Nodata";
import Text from "@/components/custom/text-custom/TextCustom";
import Title from "@/components/custom/title-custom/TitleCustom";
import { IProduct } from "@/schemas/product.schema";
import { useGetProductList } from "@/tantask/product.tanstack";
import { TResPagination } from "@/types/app.type";
import { EProductCategory } from "@/types/enum/product.enum";
import { Badge, Box, Button, Center, Group, Stack, Tabs } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ProductItem from "../product-item/ProductItem";
import classes from "./ProductList.module.css";

type TProps = {
   products: TResPagination<IProduct>;
};

function ProductList({ products: initialProducts }: TProps) {
   const t = useTranslations();
   const [category, setCategory] = useState<string>("0");
   const [products, setProducts] = useState(initialProducts.items);
   const [page, setPage] = useState(1);
   const totalPage = useRef(initialProducts.totalPage);
   const onlyOne = useRef(true);

   const getProductList = useGetProductList();

   useEffect(() => {
      if (onlyOne.current) {
         onlyOne.current = false;
         return;
      }
      getProductList.mutate(
         { page: 1, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.totalPage;
               setProducts(data.items);
            },
         }
      );
   }, [category]);

   useEffect(() => {
      if (page < 2 || page > totalPage.current) return;
      getProductList.mutate(
         { page, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.totalPage;
               const newProducts = [...products, ...data.items];
               setProducts(newProducts);
            },
         }
      );
   }, [page, category]);

   const handleLoadMore = () => {
      setPage((prev) => {
         return prev + 1;
      });
   };

   return (
      <Stack style={{ minHeight: `calc(100dvh - var(--height-header-client))` }} gap={50}>
         <Box>
            <Group justify="center">
               <Badge variant="filled" size="lg">
                  {t(`Pet Product`)}
               </Badge>
            </Group>

            <Title order={2} className={classes.title} ta="center" mt="sm">
               High-Quality & Essential Pet Products
            </Title>

            <Text c="dimmed" className={classes.description} ta="center" mt="md">
               We offer
            </Text>
         </Box>

         <Stack>
            <Tabs
               value={category}
               onChange={(e) => {
                  if (e) setCategory(e);
               }}
            >
               <Tabs.List>
                  {Object.keys(EProductCategory)
                     .filter((key) => !isNaN(Number(key)))
                     .map((key) => {
                        return (
                           <Tabs.Tab key={key} value={key}>
                              {EProductCategory[Number(key)]}
                           </Tabs.Tab>
                        );
                     })}
               </Tabs.List>
            </Tabs>

            <Stack w={`100%`}>
               <Box className={`${classes[`box-container`]}`}>
                  {products.map((product, i) => {
                     return (
                        <Box
                           key={product._id as string}
                           style={{
                              opacity: "0",
                              animation: "fadeInUp 0.5s forwards",
                              animationDelay: `${50 * i}ms`,
                           }}
                        >
                           <ProductItem product={product} />
                        </Box>
                     );
                  })}
               </Box>
               {products.length > 0 ? (
                  <Center>
                     <Button
                        loading={getProductList.isPending}
                        disabled={page === totalPage.current}
                        onClick={handleLoadMore}
                        variant="default"
                        w={300}
                     >
                        {t(`See more`)}
                     </Button>
                  </Center>
               ) : (
                  <Center w={`100%`}>
                     <Nodata />
                  </Center>
               )}
            </Stack>
         </Stack>
      </Stack>
   );
}

export default ProductList;
