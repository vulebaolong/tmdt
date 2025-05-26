"use client";

import Nodata from "@/components/no-data/Nodata";
import { IProduct } from "@/schemas/product.schema";
import { useGetProductList } from "@/tantask/product.tanstack";
import { TResPagination } from "@/types/app.type";
import { EProductCategory } from "@/types/enum/product.enum";
import { Badge, Box, Button, Center, Group, Stack, Tabs, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import ProductItem2 from "../product-item/ProductItem2";
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
      <Stack gap={50}>
         <Box>
            <Group justify="center">
               <Badge variant="filled" size="lg">
                  Nail Product
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
               High-Quality & Essential Nail Products
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
               We offer a wide range of carefully selected nail products including gel polish, manicure tools, accessories, and nail care treatments.
               All products are designed to ensure the beauty, durability, and health of your nails every day.
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
                           <ProductItem2 product={product} />
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
