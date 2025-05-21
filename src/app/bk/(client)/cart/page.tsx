import ProductCart from "@/components/product/product-cart/ProductCart";
import RootPage from "@/components/root-page/RootPage";

export default async function page() {
   return (
      <RootPage>
         <ProductCart />
      </RootPage>
   );
}
