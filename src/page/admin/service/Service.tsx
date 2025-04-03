"use client";

import ContentAdmin, { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import ProductImage from "@/components/product/product-image/ProductImage";
import ProductUploadImage from "@/components/product/product-upload-image/ProductUploadImage";
import { formatLocalTime } from "@/helpers/function.helper";
import { IService } from "@/schemas/service.schema";
import { useCreateService, useDeleteService, useServices, useUpdateService } from "@/tantask/service.tanstack";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { Text } from "@mantine/core";
import classes from "./Service.module.css";
import { useTranslations } from "next-intl";
import { EServiceCategory } from "@/types/enum/service.enum";

export default function Service() {
   const t = useTranslations();
   const columnHelper = createColumnHelper<IService>();
   const columns = useMemo(
      () => [
         columnHelper.accessor("_id", {
            header: "ID",
            size: 100,
            cell: ({ cell }) => (
               <Text truncate="end" maw={100} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue() as string}
               </Text>
            ),
         }),
         columnHelper.accessor("thumbnail", {
            header: t("Image"),
            size: 150,
            cell: ({ cell }) => <ProductImage width="50px" src={cell.getValue()} />,
         }),
         columnHelper.accessor("title", {
            header: t("Title"),
            size: 150,
            cell: ({ cell }) => (
               <Text lineClamp={2} maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("category", {
            header: t("Category"),
            size: 150,
            cell: ({ cell }) => (
               <Text lineClamp={2} maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {EServiceCategory[cell.getValue()]}
               </Text>
            ),
         }),
         columnHelper.accessor("content", {
            header: t("Content"),
            size: 150,
            cell: ({ cell }) => (
               <div
                  dangerouslySetInnerHTML={{ __html: cell.getValue() }}
                  style={{
                     whiteSpace: "nowrap",
                     height: 50,
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     maxWidth: 150,
                  }}
               />
            ),
         }),
         columnHelper.accessor("createdAt", {
            header: t("CreatedAt"),
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm">
                  {formatLocalTime(cell.getValue())}
               </Text>
            ),
         }),
      ],
      []
   );

   const fields: TFieldCreate[] = useMemo(
      () => [
         {
            label: t("Image"),
            name: "thumbnail",
            type: "custom",
            component: ({ value, error, setValue }) => (
               <ProductUploadImage
                  value={value}
                  onChange={(e) => {
                     console.log({ e });
                     setValue(e);
                  }}
                  error={error}
               />
            ),
         },
         { label: t("Title"), name: "title", type: "text", withAsterisk: true },
         { label: t("Content"), name: "content", type: "edtior" },
         {
            label: "Category",
            name: "category",
            type: "radio",
            dataTags: Object.entries(EServiceCategory)
               .filter(([, value]) => !isNaN(Number(value))) 
               .map(([key, value]) => ({
                  label: key,
                  value: String(value),
               })),
         },
      ],
      []
   );

   return (
      <>
         <ContentAdmin<IService>
            columns={columns}
            creates={fields}
            fetchData={useServices}
            onCreate={useCreateService}
            onUpdate={useUpdateService}
            onDelete={useDeleteService}
         />
      </>
   );
}
