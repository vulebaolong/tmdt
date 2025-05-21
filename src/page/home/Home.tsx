import Banner2 from "@/components/banner/Banner2";
import ProductList from "@/components/product/product-list/ProductList";
import { Service } from "@/components/Service/Service";
import { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { Box, Container, Stack } from "@mantine/core";

type TProps = {
   products?: TResPagination<IProduct>;
};

export default function Home({ products }: TProps) {
   return (
      <>
         <Banner2 />
         <Box py={100}>
            <Stack gap={150}>
               <Container>
                  <Service />
               </Container>
               <Container>
                  {products && <ProductList products={products} />}
               </Container>
            </Stack>
         </Box>
      </>
   );
}
