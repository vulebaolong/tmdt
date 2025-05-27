"use client";

import ContentAdmin, { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import ProductImage from "@/components/product/product-image/ProductImage";
import ProductPreview from "@/components/product/product-preview/ProductPreview";
import ProductUploadImages from "@/components/product/product-upload-image/ProductUploadImages";
import { formatLocalTime, getEnumKeys, renderData } from "@/helpers/function.helper";
import { IProduct } from "@/schemas/product.schema";
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from "@/tantask/product.tanstack";
import { EProductCategory } from "@/types/enum/product.enum";
import { Box, Stack, Text } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import classes from "./Product.module.css";
import { Carousel } from "@mantine/carousel";

export default function Product() {
   const t = useTranslations();

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
            header: t("Name"),
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("imagePublicIds", {
            header: t("Image"),
            size: 300,
            cell: ({ cell }) => {
               const images = cell.getValue() as string[];
               return (
                  <Carousel slideSize="50%" slideGap="xs" withIndicators={false} mah={200} mt="md" emblaOptions={{ align: "start" }}>
                     {images.map((img, i) => (
                        <Carousel.Slide key={i}>
                           <Box>
                              <ProductImage src={img} />
                           </Box>
                        </Carousel.Slide>
                     ))}
                  </Carousel>
               );
            },
         }),
         columnHelper.accessor("description", {
            header: t("Description"),
            size: 150,
            cell: ({ cell }) => (
               <Text lineClamp={2} maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
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
         columnHelper.accessor("brand", {
            header: t("Brand"),
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue()}
               </Text>
            ),
         }),
         columnHelper.accessor("inStock", {
            header: t("InStock"),
            size: 150,
            cell: ({ cell }) => (
               <Text c={cell.getValue() ? `green` : `red`} truncate="end" maw={150} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue() ? `Còn hàng` : `Hết hàng`}
               </Text>
            ),
         }),
         columnHelper.accessor("category", {
            header: t("Category"),
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
            header: t("Price"),
            size: 150,
            cell: ({ cell }) => {
               return (
                  <Text style={{ fontWeight: 900 }} fz={18} c={`shopee`}>
                     ₫{renderData(cell.getValue())}
                  </Text>
               );
            },
         }),
         columnHelper.accessor("shippingFee", {
            header: t("Shipping Fee"),
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
            header: t("Sold"),
            size: 150,
            cell: ({ cell }) => {
               return <Text fz={14}>{renderData(cell.getValue())}</Text>;
            },
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
         // {
         //    label: t("Image"),
         //    name: "imagePublicId",
         //    type: "custom",
         //    component: ({ value, error, setValue }) => <ProductUploadImage value={value} onChange={setValue} error={error} />,
         // },
         {
            label: `Images`,
            name: "imagePublicIds",
            type: "custom",
            withAsterisk: true,
            component: ({ value, error, setValue }) => <ProductUploadImages value={value} onChange={setValue} error={error} />,
         },
         { label: t("Name"), name: "name", type: "text", withAsterisk: true },
         { label: t("Description"), name: "description", type: "textArea", maxRows: 5, resize: `vertical`, withAsterisk: true },
         {
            label: t("Content"),
            name: "content",
            type: "editor",
            withAsterisk: true,
         },
         { label: t("Brand"), name: "brand", type: "text", withAsterisk: true },
         {
            type: "select",
            name: "inStock",
            label: t("InStock"),
            dataSelect: [
               { value: "true", label: "Còn hàng" },
               { value: "false", label: "Hết hàng" },
            ],
            withAsterisk: true,
         },
         {
            label: t("Category"),
            name: "category",
            placeholder: "Danh mục",
            type: "tags",
            enum: EProductCategory,
            dataTags: getEnumKeys(EProductCategory),
            withAsterisk: true,
         },
         {
            label: t("Shipping Fee"),
            name: "shippingFee",
            type: "number",
            suffix: "₫",
            leftSection: <IconCurrencyDollar />,
            thousandSeparator: ",",
            defaultValue: 1_000_000,
            withAsterisk: true,
         },
         {
            label: t("Price"),
            name: "price",
            type: "number",
            suffix: "₫",
            leftSection: <IconCurrencyDollar />,
            thousandSeparator: ",",
            defaultValue: 1_000_000,
            withAsterisk: true,
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
            title={t("product.Product")}
            columns={columns}
            creates={fields}
            updates={fields}
            fetchData={useProducts}
            onCreate={useCreateProduct}
            onUpdate={useUpdateProduct}
            onDelete={useDeleteProduct}
            heightScrollTable={600}
         />
      </>
   );
}
