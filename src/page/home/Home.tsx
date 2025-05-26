import About from "@/components/about/About";
import Album from "@/components/album/Album";
import Banner2 from "@/components/banner/Banner2";
import Blog from "@/components/blog/Blog";
import Preview from "@/components/preview/Preview";
import ProductNail from "@/components/product/product-nail/ProductNail";
import ServiceMail from "@/components/service-nail/ServiceNail";
import { Stack } from "@mantine/core";

export default function Home() {
   return (
      <Stack gap={50}>
         <Banner2 />
         <About />
         <ServiceMail />
         <ProductNail />
         <Preview />
         <Blog />
         <Album />
      </Stack>
   );
}
