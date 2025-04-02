import RootPage from "@/components/root-page/RootPage";
import Transaction from "@/page/transaction/Transaction";

export default async function page() {
   return (
      <RootPage>
         <Transaction />
      </RootPage>
   );
}
