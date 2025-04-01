import ProductList from "@/components/product/product-list/ProductList";
import { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { Box, Container } from "@mantine/core";

type TProps = {
   products?: TResPagination<IProduct>;
};

export default function Product({ products }: TProps) {
   return (
      <Box py={100}>
         <Container>
            <Box style={{ minHeight: `calc(100dvh - var(--height-header))` }}>{products && <ProductList products={products} />}</Box>
         </Container>
      </Box>
   );
}
