import { getProductByIdAction } from "@/actions/product.action";
import ProductDetail from "@/page/product/ProductDetail";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   const { id } = await params;
   const product = await getProductByIdAction(id);
   return <ProductDetail product={product} />;
}
