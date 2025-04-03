import RootPage from "@/components/root-page/RootPage";
import OrderDetail from "@/page/order/order-detail/OrderDetail";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   return (
      <RootPage>
         <OrderDetail id={(await params).id} />
      </RootPage>
   );
}
