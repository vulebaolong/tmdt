import FooterClient from "@/components/footers/footer-client/FooterClient";
import HeaderClient2 from "@/components/headers/header-client2/HeaderClient2";
import { ReactNode } from "react";

type TProps = {
   children: ReactNode;
};

export default function ClientLayout2({ children }: TProps) {
   return (
      <>
         <HeaderClient2 />
         <main>{children}</main>
         <FooterClient />
      </>
   );
}
