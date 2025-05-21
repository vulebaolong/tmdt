import { getProductByIdAction } from "@/actions/product.action";
import ProductDetail from "@/components/product/product-detail/ProductDetail";
import RootPage from "@/components/root-page/RootPage";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   const { id } = await params;
   const product = await getProductByIdAction(id);
   return (
      <RootPage>
         <ProductDetail product={product} />
      </RootPage>
   );
}
