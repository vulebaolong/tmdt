import { getProductListAction } from "@/actions/product.action";
import RootPage from "@/components/root-page/RootPage";
import Home from "@/page/home/Home";

export default async function page() {
   const products = await getProductListAction(1);
   return (
      <RootPage>
         <Home products={products} />
      </RootPage>
   );
}
