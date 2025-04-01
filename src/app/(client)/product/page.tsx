import { getProductListAction2 } from "@/actions/product.action";
import RootPage from "@/components/root-page/RootPage";
import Product from "@/page/product/Product";

export default async function page() {
   const products = await getProductListAction2({ page: 1, category: undefined });

   return (
      <RootPage>
         <Product products={products} />
      </RootPage>
   );
}
