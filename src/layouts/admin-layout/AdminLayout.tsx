"use client";

import HeaderAdmin from "@/components/header-admin/HeaderAdmin";
import NavAdmin from "@/components/nav-admin/NavAdmin";
import { Box, Title } from "@mantine/core";
import { ReactNode, useState } from "react";
import classes from "./AdminLayout.module.css";

type TProps = {
   children: ReactNode;
};

export default function AdminLayout({ children }: TProps) {
   const [title, setTitle] = useState(``);
   return (
      <>
         <HeaderAdmin />
         <NavAdmin setTitle={setTitle} />
         <main className={`${classes[`box-1`]}`}>
            <Box p={20}>
               <Title order={1}>{title}</Title>
            </Box>
            {children}
         </main>
      </>
   );
}
