import RootPage from "@/components/root-page/RootPage";
import ServiceList from "@/page/service/service-list/ServiceList";

export default async function page() {
   return (
      <RootPage>
         <ServiceList />
      </RootPage>
   );
}
