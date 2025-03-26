import RootPage from "@/components/root-page/RootPage";
import Login from "@/page/auth/login/Login";

export default async function page() {
   return (
      <RootPage>
         <Login />
      </RootPage>
   );
}
