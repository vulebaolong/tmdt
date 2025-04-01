"use client";

import Nodata from "@/components/no-data/Nodata";
import ROUTER from "@/constant/router.constant";
import { IProduct } from "@/schemas/product.schema";
import { useGetProductList } from "@/tantask/product.tanstack";
import { TResPagination } from "@/types/app.type";
import { Box, Button, Center, Group, NavLink, Stack, Text } from "@mantine/core";
import { IconCategory } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductItem from "../product-item/ProductItem";
import classes from "./ProductList.module.css";

type TProps = {
   products: TResPagination<IProduct>;
};

function ProductList({ products: initialProducts }: TProps) {
   const [category, setCategory] = useState<string | undefined | null>(null);
   const [products, setProducts] = useState(initialProducts.items);
   const [page, setPage] = useState(1);
   const totalPage = useRef(initialProducts.pageCount);
   const pathname = usePathname();
   const router = useRouter();

   const getProductList = useGetProductList();

   useEffect(() => {
      if (category === null) return;
      getProductList.mutate(
         { page: 1, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.pageCount;
               setProducts(data.items);
            },
         }
      );
   }, [category]);

   useEffect(() => {
      if (category === null) return;

      if (page < 2 || page > totalPage.current) return;
      getProductList.mutate(
         { page, category },
         {
            onSuccess: (data) => {
               totalPage.current = data.pageCount;
               const newProducts = [...products, ...data.items];
               setProducts(newProducts);
            },
         }
      );
   }, [page]);

   const handleLoadMore = () => {
      if (ROUTER.HOME === pathname) {
         router.push(ROUTER.PRODUCT);
      } else {
         setPage((prev) => {
            return prev + 1;
         });
      }
   };

   return (
      <Group wrap="nowrap" align="start">
         {ROUTER.PRODUCT === pathname && (
            <Stack style={{ flexShrink: 0, width: 200, height: `100%` }}>
               <Group gap={2}>
                  <IconCategory />
                  <Text fw={700}>Danh mục sản phẩm</Text>
               </Group>
               <Stack gap={0}>
                  <NavLink
                     active={category === null || category === undefined}
                     onClick={() => {
                        setCategory(() => undefined);
                     }}
                     label={`Tất cả`}
                  />
                  <NavLink
                     active={category === `0`}
                     onClick={() => {
                        setCategory(() => `0`);
                     }}
                     label={`Thức ăn thú cưng`}
                  />
                  <NavLink
                     active={category === `1`}
                     onClick={() => {
                        setCategory(() => `1`);
                     }}
                     label={`Phụ kiện & đồ chơi`}
                  />
                  <NavLink
                     active={category === `2`}
                     onClick={() => {
                        setCategory(() => `2`);
                     }}
                     label={`Thuốc & mỹ phẩm`}
                  />
               </Stack>
            </Stack>
         )}

         <Stack w={`100%`}>
            <Box className={`${classes[`box-container`]}`}>
               {products.map((product, i) => {
                  return <ProductItem key={i} product={product} />;
               })}
            </Box>
            {products.length > 0 ? (
               <Center>
                  <Button loading={getProductList.isPending} disabled={page === totalPage.current} onClick={handleLoadMore} variant="default" w={300}>
                     Xem Thêm
                  </Button>
               </Center>
            ) : (
               <Center w={`100%`}>
                  <Nodata />
               </Center>
            )}
         </Stack>
      </Group>
   );
}

export default ProductList;
