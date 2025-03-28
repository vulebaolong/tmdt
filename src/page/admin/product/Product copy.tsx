"use client";

import ProductItem from "@/components/product/product-item/ProductItem";
import { useCreateProduct } from "@/tantask/product.tanstack";
import { EProductTag } from "@/types/enum/product.enum";
import { Avatar, Box, Button, Center, Group, NumberInput, Paper, rem, Stack, TagsInput, Text, TextInput } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCurrencyDollar, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import classes from "./Product.module.css";

export default function Product() {
   const [file, setFile] = useState<File | null>(null);
   const [preview, setPreview] = useState<string | null>(null);

   const createProduct = useCreateProduct();

   const createProductForm = useFormik({
      initialValues: {
         name: ``,
         tag: [],
         price: 0,
      },
      validationSchema: Yup.object().shape({
         name: Yup.string().trim().required(),
         price: Yup.number().required("Giá sản phẩm bắt buộc").moreThan(0, "Giá sản phẩm phải lớn hơn 0").integer("Giá sản phẩm phải là số nguyên"),
      }),
      onSubmit: async (valuesRaw) => {
         console.log({ valuesRaw });

         if (file === null) return;
         const fromData = new FormData();

         fromData.append("file", file);

         const payload = {
            name: valuesRaw.name.trim(),
            tags: valuesRaw.tag,
            price: valuesRaw.price,
            imageFromData: fromData,
         };

         createProduct.mutate(payload, {
            onSuccess: () => {
               toast.success(`Thêm sản phẩm thành công`);
               setFile(null);
               setPreview(null);
               createProductForm.resetForm();
            },
         });
      },
   });

   return (
      <Stack p={20}>
         <Box className={`${classes[`box-1`]}`}>
            <Paper shadow="md" radius="lg" withBorder p="xl">
               <Box component="form" onSubmit={createProductForm.handleSubmit}>
                  <Stack>
                     <Paper shadow="lg" radius="lg" withBorder bg="var(--mantine-color-body)">
                        <Dropzone
                           onDrop={(files) => {
                              console.log("accepted files", files);
                              if (!files) return;
                              setFile(files[0]);
                              setPreview(URL.createObjectURL(files[0]));
                           }}
                           onReject={(files) => console.log("rejected files", files)}
                           maxSize={5 * 1024 ** 2}
                           accept={IMAGE_MIME_TYPE}
                        >
                           <Group p={20} justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                              <Dropzone.Accept>
                                 <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
                              </Dropzone.Accept>
                              <Dropzone.Reject>
                                 <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
                              </Dropzone.Reject>
                              <Dropzone.Idle>
                                 {preview ? (
                                    <Avatar src={preview} size={120} />
                                 ) : (
                                    <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                                 )}
                              </Dropzone.Idle>

                              <div>
                                 <Text ta={`center`} size="md" inline>
                                    Drag images here or click to select files
                                 </Text>
                                 <Text ta={`center`} size="sm" c="dimmed" inline mt={7}>
                                    Attach as many files as you like, each file should not exceed 5mb
                                 </Text>
                              </div>
                           </Group>
                        </Dropzone>
                     </Paper>

                     <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Name"
                        name="name"
                        value={createProductForm.values.name}
                        onChange={createProductForm.handleChange}
                        error={
                           createProductForm.touched.name && typeof createProductForm.errors.name === "string"
                              ? createProductForm.errors.name
                              : undefined
                        }
                        inputWrapperOrder={["label", "input", "error"]}
                     />

                     <TagsInput
                        placeholder="Nhãn"
                        acceptValueOnBlur={false}
                        label="Nhãn"
                        data={Object.keys(EProductTag).filter((key) => isNaN(Number(key)))}
                        onChange={(e) => {
                           createProductForm.setFieldValue(
                              "tag",
                              e.map((item) => EProductTag[item as keyof typeof EProductTag] as number)
                           );
                        }}
                        inputWrapperOrder={["label", "input", "error"]}
                     />

                     <NumberInput
                        withAsterisk
                        label="Giá"
                        placeholder="Giá"
                        name="price"
                        value={createProductForm.values.price}
                        onChange={(e) => {
                           createProductForm.setFieldValue("price", e);
                        }}
                        error={
                           createProductForm.touched.price && typeof createProductForm.errors.price === "string"
                              ? createProductForm.errors.price
                              : undefined
                        }
                        inputWrapperOrder={["label", "input", "error"]}
                        suffix="₫"
                        leftSection={<IconCurrencyDollar />}
                        thousandSeparator=","
                        defaultValue={1_000_000}
                     />

                     <Button loading={createProduct.isPending} type="submit">
                        Tạo Sản Phẩm
                     </Button>
                  </Stack>
               </Box>
            </Paper>
            <Paper shadow="md" radius="lg" withBorder p="xl">
               <Center h={`100%`}>
                  <Box w={215}>
                     <ProductItem
                        type="review"
                        product={
                           {
                              images: [preview],
                              name: createProductForm.values.name,
                              tag: createProductForm.values.tag,
                              price: createProductForm.values.price,
                           } as any
                        }
                     />
                  </Box>
               </Center>
            </Paper>
         </Box>
      </Stack>
   );
}
