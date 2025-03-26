import { getProductByIdAction } from "@/actions/product.action";
import Product from "@/page/product/Product";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   const { id } = await params;
   const product = await getProductByIdAction(id);
   return <Product product={product} />;
}
