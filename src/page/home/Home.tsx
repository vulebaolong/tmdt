import ProductList from "@/components/product/product-list/ProductList";
import { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { Box, Container } from "@mantine/core";

type TProps = {
   products?: TResPagination<IProduct[]>;
};

export default function Home({ products }: TProps) {
   return (
      <Container py={100}>
         <Box style={{ minHeight: `calc(100dvh - var(--height-header))` }}>{products && <ProductList products={products} />}</Box>
      </Container>
   );
}
