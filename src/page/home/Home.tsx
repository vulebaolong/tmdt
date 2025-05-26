import About from "@/components/about/About";
import Banner2 from "@/components/banner/Banner2";
import ProductRoot from "@/components/product/product-root/ProductRoot";
import ServiceMail from "@/components/service-nail/ServiceNail";
import { Stack } from "@mantine/core";

export default function Home() {
   return (
      <Stack gap={50}>
         <Banner2 />
         <About />
         <ServiceMail />
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
