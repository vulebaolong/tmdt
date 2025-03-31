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
      <Box py={100}>
         <Stack gap={50}>
            <Container>
               <Service />
            </Container>
            <Container>
               <Box style={{ minHeight: `calc(100dvh - var(--height-header))` }}>{products && <ProductList products={products} />}</Box>
            </Container>
         </Stack>
      </Box>
   );
}
