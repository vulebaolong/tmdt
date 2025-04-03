import RootPage from "@/components/root-page/RootPage";
import ServiceDetail from "@/page/service/service-detail/ServiceDetail";

// type TProps = {
//    params: Promise<{ id: string }>;
// };

export default async function page() {
   return (
      <RootPage>
         {/* <ServiceDetail id={(await params).id} /> */}
         <ServiceDetail />
      </RootPage>
   );
}
