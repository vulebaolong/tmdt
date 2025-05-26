"use client";

import ContentAdmin, { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import { enumToOptions, formatLocalTime } from "@/helpers/function.helper";
import { TUser } from "@/schemas/user.schema";
import { useDeleteProduct } from "@/tantask/product.tanstack";
import { useUpdateUser, useUsers } from "@/tantask/user.tantack";
import { ERole } from "@/types/enum/role.enum";
import { Badge, Text } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function User() {
   const t = useTranslations();

   const columnHelper = createColumnHelper<TUser>();
   const columns = useMemo(
      () => [
         columnHelper.accessor("_id", {
            header: "ID",
            size: 100,
            cell: ({ cell }) => (
               <Text truncate="end" maw={100} size="sm" ta={`start`}>
                  {cell.getValue() as string}
               </Text>
            ),
         }),
         columnHelper.accessor("email", {
            header: `Email`,
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("phone", {
            header: `Phone`,
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("address", {
            header: `Address`,
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("role", {
            header: `Role`,
            size: 150,
            cell: ({ cell }) => <Badge color={cell.getValue() === ERole[`Admin`] ? "red" : "green"}>{ERole[cell.getValue()]}</Badge>,
         }),
         columnHelper.accessor("createdAt", {
            header: t("CreatedAt"),
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} size="sm">
                  {formatLocalTime(cell.getValue())}
               </Text>
            ),
         }),
      ],
      []
   );

   const fields: TFieldCreate[] = useMemo(
      () => [
         { label: `Email`, name: "email", type: "text", withAsterisk: true },
         { label: `Fullname`, name: "fullName", type: "text", withAsterisk: true },
         { label: `Phone`, name: "phone", type: "text", withAsterisk: true },
         { label: `Address`, name: "address", type: "text", withAsterisk: true },
         {
            type: "select",
            name: "role",
            label: `Role`,
            dataSelect: enumToOptions(ERole),
         },
      ],
      []
   );

   return (
      <>
         <ContentAdmin<TUser>
            title={t("product.Product")}
            columns={columns}
            creates={fields}
            updates={fields}
            fetchData={useUsers}
            // onCreate={useCreateProduct}
            onUpdate={useUpdateUser}
            onDelete={useDeleteProduct}
         />
      </>
   );
}
