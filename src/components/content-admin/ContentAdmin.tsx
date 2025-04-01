import { buildFormDataOrObject, buildInitialValues, buildValidationSchema } from "@/helpers/function.helper";
import { TResPagination } from "@/types/app.type";
import { Box, Button, Center, Drawer, Group, Modal, NumberInput, Select, Stack, TagsInput, Text, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { FormikProps, useFormik } from "formik";
import React, { ReactNode, useRef, useState } from "react";
import TableCustom, { TPayload } from "../table-custom/TableCustom";

export type TFieldCreate = {
   label: string;
   name: string;
   type: "text" | "number" | "select" | "date" | "custom" | "tags" | "textArea";
   options?: string[];
   placeholder?: string;
   dataTags?: any;
   dataSelect?: any;
   enum?: any;
   onChangeTags?: any;
   withAsterisk?: boolean;
   defaultValue?: string | number;
   suffix?: string;
   leftSection?: ReactNode;
   thousandSeparator?: string | boolean;
   autosize?: boolean;
   minRows?: number;
   maxRows?: number;
   resize?: React.CSSProperties["resize"];
   validate?: (Yup: typeof import("yup"), base: any) => any;
   component?: (props: { value: any; error: string | undefined; setValue: (value: any) => void; createForm: FormikProps<any> }) => React.ReactElement;
};

type TProps<T> = {
   columns: any;
   creates: TFieldCreate[];
   onCreate: () => UseMutationResult<any, Error, any, unknown>;
   onUpdate: () => UseMutationResult<any, Error, any, unknown>;
   onDelete: () => UseMutationResult<any, Error, any, unknown>;
   fetchData: (payload: TPayload) => UseQueryResult<TResPagination<T>>;
};

export default function ContentAdmin<T>({ columns, creates, onCreate, onUpdate, onDelete, fetchData }: TProps<T>) {
   const [opened, { open, close }] = useDisclosure(false);
   const [openedModalDelete, handleModalDelete] = useDisclosure(false);
   const [editData, setEditData] = useState(null);
   const resolveRef = useRef<(value: any) => void>(null);
   const rejectRef = useRef<(value: any) => void>(null);

   const create = onCreate();
   const update = onUpdate();
   const deletee = onDelete();

   const initialValues = buildInitialValues(creates);
   const validationSchema = buildValidationSchema(creates);

   const waitForDelete = () => {
      return new Promise<any>((resolve, reject) => {
         handleModalDelete.open();
         resolveRef.current = resolve;
         rejectRef.current = reject;
      });
   };

   const createForm = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
         const payload = buildFormDataOrObject(values);
         console.log(payload);
         if (editData) {
            update.mutate(payload, {
               onSuccess: () => {
                  close();
                  createForm.resetForm();
               },
            });
         } else {
            create.mutate(payload, {
               onSuccess: () => {
                  close();
                  createForm.resetForm();
               },
            });
         }
      },
   });

   return (
      <>
         <Box px={20}>
            <Button
               variant="filled"
               onClick={() => {
                  setEditData(null);
                  open();
               }}
            >
               Create
            </Button>
         </Box>
         <TableCustom<T>
            styleTableTh={{ textAlign: `center` }}
            styleTableTd={{ textAlign: `center` }}
            heightScroll={400}
            columns={columns}
            fetchData={fetchData}
            // filters={{ type: `1` }}
            onEdit={(item: any) => {
               setEditData(item);
               createForm.setValues(item);
               open();
            }}
            onDelete={async (item: any) => {
               await waitForDelete();
               console.log({ item });
               deletee.mutate(item._id, {
                  onSuccess: () => {
                     handleModalDelete.close();
                  },
               });
            }}
         />
         <Drawer
            position={`right`}
            opened={opened}
            onClose={() => {
               close();
               createForm.resetForm();
               setEditData(null);
            }}
            title={editData ? "Update" : "Create"}
         >
            <form onSubmit={createForm.handleSubmit}>
               <Stack>
                  {creates.map((field) => {
                     const error =
                        createForm.touched[field.name] && typeof createForm.errors[field.name] === "string"
                           ? (createForm.errors[field.name] as string)
                           : undefined;

                     if (field.type === "custom" && field.component) {
                        return (
                           <Box key={field.name}>
                              <label>{field.label}</label>
                              {field.component({
                                 value: createForm.values[field.name],
                                 error,
                                 setValue: (value) => createForm.setFieldValue(field.name, value),
                                 createForm,
                              })}
                           </Box>
                        );
                     }

                     if (field.type === "text") {
                        return (
                           <TextInput
                              key={field.name}
                              placeholder={field.placeholder || field.label}
                              withAsterisk={field.withAsterisk}
                              label={field.label}
                              name={field.name}
                              value={createForm.values[field.name]}
                              onChange={createForm.handleChange}
                              error={error}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     if (field.type === "textArea") {
                        return (
                           <Textarea
                              key={field.name}
                              placeholder={field.placeholder || field.label}
                              withAsterisk={field.withAsterisk}
                              label={field.label}
                              name={field.name}
                              autosize={field.autosize}
                              resize={field.resize}
                              minRows={field.minRows}
                              maxRows={field.maxRows}
                              value={createForm.values[field.name]}
                              onChange={createForm.handleChange}
                              error={error}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     if (field.type === "number") {
                        return (
                           <NumberInput
                              key={field.name}
                              withAsterisk={field.withAsterisk}
                              label={field.label}
                              name={field.name}
                              value={createForm.values[field.name]}
                              onChange={(value) => createForm.setFieldValue(field.name, value)}
                              error={error}
                              inputWrapperOrder={["label", "input", "error"]}
                              suffix={field.suffix}
                              leftSection={field.leftSection}
                              thousandSeparator={field.thousandSeparator}
                              defaultValue={field.defaultValue}
                           />
                        );
                     }

                     if (field.type === "select") {
                        return (
                           <Select
                              key={field.name}
                              label={field.label}
                              placeholder={field.placeholder || field.label}
                              withAsterisk={field.withAsterisk}
                              data={field.dataTags}
                              value={String(createForm.values[field.name])}
                              onChange={(value) => {
                                 if (value === "true" || value === "false") {
                                    createForm.setFieldValue(field.name, value === "true");
                                 } else {
                                    createForm.setFieldValue(field.name, value);
                                 }
                              }}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     if (field.type === "tags") {
                        return (
                           <TagsInput
                              placeholder={field.placeholder || field.label}
                              key={field.name}
                              withAsterisk={field.withAsterisk}
                              label={field.label}
                              data={field.dataTags}
                              value={(createForm.values[field.name] || [])
                                 .map((item: number) => field.enum[item])
                                 .filter(Boolean)} 
                              onChange={(e) => {
                                 createForm.setFieldValue(
                                    field.name,
                                    e.map((item: any) => field.enum[item as keyof typeof field.enum] as number)
                                 );
                              }}
                              defaultValue={[`1`]}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     return null;
                  })}
                  <Button loading={update.isPending || create.isPending} type="submit">
                     Save
                  </Button>
               </Stack>
            </form>
         </Drawer>
         <Modal opened={openedModalDelete} onClose={handleModalDelete.close} styles={{ content: { borderRadius: `15px` } }}>
            <Stack>
               <Text ta={`center`} size="lg" fw={`bold`}>
                  Are you sure you want to delete?
               </Text>
               <Center>
                  <Group>
                     <Button
                        onClick={() => {
                           if (rejectRef.current) {
                              rejectRef.current(false);
                              rejectRef.current = null;
                              handleModalDelete.close();
                           }
                        }}
                        variant="outline"
                        disabled={deletee.isPending}
                        mr={10}
                     >
                        Cancel
                     </Button>
                     <Button
                        loading={deletee.isPending}
                        onClick={() => {
                           if (resolveRef.current) {
                              resolveRef.current(true);
                              resolveRef.current = null;
                           }
                        }}
                     >
                        Submit
                     </Button>
                  </Group>
               </Center>
            </Stack>
         </Modal>
      </>
   );
}
