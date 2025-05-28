"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type TProps = {
   children: React.ReactNode;
};

export default function AOSProvider({ children }: TProps) {
   useEffect(() => {
      AOS.init({
         duration: 600,
         once: true,
         // offset: window.innerHeight / 2
      });
   }, []);
   return <>{children}</>;
}
