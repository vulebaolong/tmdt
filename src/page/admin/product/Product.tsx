"use client";

import ContentAdmin, { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import ProductImage from "@/components/product/product-image/ProductImage";
import ProductPreview from "@/components/product/product-preview/ProductPreview";
import ProductTag from "@/components/product/product-tag/ProductTag";
import ProductUploadImage from "@/components/product/product-upload-image/ProductUploadImage";
import { formatLocalTime, renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from "@/tantask/product.tanstack";
import { EProductCategory, EProductTag } from "@/types/enum/product.enum";
import { Stack, Text } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import classes from "./Product.module.css";

export default function Product() {
   const columnHelper = createColumnHelper<IProduct>();
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
         columnHelper.accessor("name", {
            header: "Tên",
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("imagePublicId", {
            header: "Hình",
            size: 150,
            cell: ({ cell }) => <ProductImage width="50px" src={cell.getValue()} />,
         }),
         columnHelper.accessor("description", {
            header: "Nội dung",
            size: 150,
            cell: ({ cell }) => (
               <Text lineClamp={2} maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("brand", {
            header: "Thương hiệu",
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("inStock", {
            header: "Tình trạng",
            size: 150,
            cell: ({ cell }) => (
               <Text c={cell.getValue() ? `green` : `red`} truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue() ? `Còn hàng` : `Hết hàng`}
               </Text>
            ),
         }),
         columnHelper.accessor("tags", {
            header: "Nhãn",
            size: 150,
            cell: ({ cell }) => {
               return cell.getValue().map((tag: number, i: number) => <ProductTag tag={tag} key={i} />);
            },
         }),
         columnHelper.accessor("category", {
            header: "Danh mục",
            size: 150,
            cell: ({ cell }) => {
               return (
                  <Stack>
                     {cell.getValue().map((cate: number, i: number) => (
                        <Text key={i} truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                           {EProductCategory[cate]}
                        </Text>
                     ))}
                  </Stack>
               );
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

   const fields: TFieldCreate[] = useMemo(
      () => [
         {
            label: "Image",
            name: "imageFromData",
            type: "custom",
            component: ({ value, error, setValue }) => <ProductUploadImage value={value} onChange={setValue} error={error} />,
         },
         { label: "Tên sản phẩm", name: "name", type: "text", withAsterisk: true },
         { label: "Nội dung", name: "description", type: "textArea", maxRows: 5, resize: `vertical` },
         { label: "Thương hiệu", name: "brand", type: "text" },
         {
            type: "select",
            name: "inStock",
            label: "Tình trạng",
            dataTags: [
              { value: "true", label: "Còn hàng" },
              { value: "false", label: "Hết hàng" },
            ],
          },
         {
            label: "Nhãn",
            name: "tags",
            placeholder: "Nhãn",
            type: "tags",
            enum: EProductTag,
            dataTags: Object.keys(EProductTag).filter((key) => isNaN(Number(key))),
         },
         {
            label: "Danh mục",
            name: "category",
            placeholder: "Danh mục",
            type: "tags",
            enum: EProductCategory,
            dataTags: Object.keys(EProductCategory).filter((key) => isNaN(Number(key))),
         },
         {
            label: "Phí vận chuyển",
            name: "shippingFee",
            type: "number",
            suffix: "₫",
            leftSection: <IconCurrencyDollar />,
            thousandSeparator: ",",
            defaultValue: 1_000_000,
         },
         {
            label: "Giá",
            name: "price",
            type: "number",
            suffix: "₫",
            leftSection: <IconCurrencyDollar />,
            thousandSeparator: ",",
            defaultValue: 1_000_000,
         },
         {
            label: "",
            name: "",
            type: "custom",
            component: ({ createForm }) => <ProductPreview createForm={createForm} />,
         },
      ],
      []
   );

   return (
      <>
         <ContentAdmin<IProduct>
            columns={columns}
            creates={fields}
            fetchData={useProducts}
            onCreate={useCreateProduct}
            onUpdate={useUpdateProduct}
            onDelete={useDeleteProduct}
         />
      </>
   );
}
