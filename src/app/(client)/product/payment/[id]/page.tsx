import { getProductByIdAction } from "@/actions/product.action";
import ProductPayment from "@/components/product/product-payment/ProductPayment";
import RootPage from "@/components/root-page/RootPage";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   const { id } = await params;
   const product = await getProductByIdAction(id);
   return (
      <RootPage>
         <ProductPayment product={product} />
      </RootPage>
   );
}
