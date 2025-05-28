import ProductList from "@/components/product/product-list/ProductList";
import TextBack from "@/components/text-back/TextBack";
import { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { Box, Container, Stack } from "@mantine/core";

type TProps = {
   products?: TResPagination<IProduct>;
};

export default function Product({ products }: TProps) {
   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />
            <Box style={{ minHeight: `calc(100dvh - var(--height-header-client))` }}>{products && <ProductList products={products} />}</Box>
         </Stack>
      </Container>
   );
}
