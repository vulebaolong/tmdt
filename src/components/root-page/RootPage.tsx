"use client";

type TProps = {
   children: React.ReactNode;
   protect?: boolean;
};

export default function RootPage({ children }: TProps) {
   return <div>{children}</div>;
}
