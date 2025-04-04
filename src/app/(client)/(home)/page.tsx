import { getProductListAction2 } from "@/actions/product.action";
import RootPage from "@/components/root-page/RootPage";
import Home from "@/page/home/Home";

export default async function page() {
   const products = await getProductListAction2({ page: 1, category: "0" });
   return (
      <RootPage>
         <Home products={products} />
      </RootPage>
   );
}
