"use client";

import ContentAdmin, { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import ProductImage from "@/components/product/product-image/ProductImage";
import ProductTag from "@/components/product/product-tag/ProductTag";
import ProductUploadImage from "@/components/product/product-upload-image/ProductUploadImage";
import { formatLocalTime, renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { useCreateProduct, useProducts } from "@/tantask/product.tanstack";
import { EProductTag } from "@/types/enum/product.enum";
import { Text } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import classes from "./Product.module.css";

export default function Product() {
   const columnHelper = createColumnHelper<IProduct>();
   const columns = useMemo(
      () => [
         columnHelper.accessor("name", {
            header: "Tên",
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("images", {
            header: "Hình",
            size: 150,
            cell: ({ cell }) => <ProductImage width="50px" src={cell.getValue()[0]} />,
         }),
         columnHelper.accessor("tags", {
            header: "Nhãn",
            size: 150,
            cell: ({ cell }) => {
               return cell.getValue().map((tag: number, i: number) => <ProductTag tag={tag} key={i} />);
            },
         }),
         columnHelper.accessor("price", {
            header: "Giá",
            size: 150,
            cell: ({ cell }) => {
               return (
                  <Text style={{ fontWeight: 900 }} fz={18} c={`shopee`}>
                     ₫{renderData(cell.getValue())}
                  </Text>
               );
            },
         }),
         columnHelper.accessor("sold", {
            header: "Đã bán",
            size: 150,
            cell: ({ cell }) => {
               return <Text fz={14}>{renderData(cell.getValue())}</Text>;
            },
         }),
         columnHelper.accessor("createdAt", {
            header: "CreatedAt",
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

   const fields: TFieldCreate[] = [
      {
         label: "",
         name: "imageFromData",
         type: "custom",
         component: ({ value, error, setValue }) => <ProductUploadImage value={value} onChange={setValue} error={error} />,
      },
      { label: "Name", name: "name", type: "text", withAsterisk: true },
      {
         label: "Nhãn",
         name: "tags",
         type: "tags",
         dataTags: Object.keys(EProductTag).filter((key) => isNaN(Number(key))),
         onChangeTags: (e: any, setFieldValue: any) => {
            setFieldValue(
               "tags",
               e.map((item: any) => EProductTag[item as keyof typeof EProductTag] as number)
            );
         },
      },
      { label: "Price", name: "price", type: "number" },
      // { label: "Status", name: "status", type: "select", options: ["active", "inactive"] },
   ];
   return (
      <>
         <ContentAdmin<IProduct> columns={columns} creates={fields} fetchData={useProducts} onCreate={useCreateProduct} title="Product" />
      </>
   );
}
