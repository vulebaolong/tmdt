"use client";

import Nodata from "@/components/no-data/Nodata";
import { IProduct } from "@/schemas/product.schema";
import { useGetProductList } from "@/tantask/product.tanstack";
import { TResPagination } from "@/types/app.type";
import { Box, Button, Center, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ProductItem from "../product-item/ProductItem";
import classes from "./ProductList.module.css";

type TProps = {
   products: TResPagination<IProduct>;
};

function ProductList({ products: initialProducts }: TProps) {
   const [products, setProducts] = useState(initialProducts.items);
   const [page, setPage] = useState(1);
   const totalPage = useRef(initialProducts.pageCount);

   const getProductList = useGetProductList();

   useEffect(() => {
      if (page < 2 || page > totalPage.current) return;
      getProductList.mutate(page, {
         onSuccess: (data) => {
            totalPage.current = data.pageCount;
            const newProducts = [...products, ...data.items];
            setProducts(newProducts);
         },
      });
   }, [page]);

   const handleLoadMore = () => {
      setPage((prev) => {
         return prev + 1;
      });
   };

   return (
      <Stack>
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
            <Nodata />
         )}
      </Stack>
   );
}

export default ProductList;
