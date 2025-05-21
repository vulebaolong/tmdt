import ClientLayout2 from "@/layouts/client-layout2/ClientLayout2";

type TProps = {
   children: React.ReactNode;
};

export default function layout({ children }: TProps) {
   return <ClientLayout2>{children}</ClientLayout2>;
}
