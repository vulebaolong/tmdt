import About from "@/components/about/About";
import Banner2 from "@/components/banner/Banner2";
import ProductRoot from "@/components/product/product-root/ProductRoot";
import Service2 from "@/components/service2/Service2";
import { IProduct } from "@/schemas/product.schema";
import { TResPagination } from "@/types/app.type";
import { Stack } from "@mantine/core";

type TProps = {
   products?: TResPagination<IProduct>;
};

export default function Home({}: TProps) {
   return (
      <Stack gap={50}>
         <Banner2 />
         <About />
         <Service2 />
         <ProductRoot />
         {/* <Stack gap={150}>
            <Container>
               <Service />
            </Container>
            <Container>{products && <ProductList products={products} />}</Container>
         </Stack> */}
      </Stack>
   );
}
