import { getServiceByIdAction } from "@/actions/service.action";
import RootPage from "@/components/root-page/RootPage";
import ServiceDetail from "@/page/service/service-detail/ServiceDetail";

type TProps = {
   params: Promise<{ id: string }>;
};

export default async function page({ params }: TProps) {
   const service = await getServiceByIdAction((await params).id);
   return (
      <RootPage>
         <ServiceDetail service={service} />
      </RootPage>
   );
}
