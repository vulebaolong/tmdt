"use client";


type TProps = {
   children: React.ReactNode;
   protect?: boolean;
};

export default function RootPage({ children}: TProps) {
   console.log(`RootPage`);
   // const pathname = usePathname();
   // const getInfo = useGetInfo();

   // useEffect(() => {
   //    if (protect) {
   //       getInfo.mutate();
   //    }
   // }, [pathname]);

   return <div>{children}</div>;
}
