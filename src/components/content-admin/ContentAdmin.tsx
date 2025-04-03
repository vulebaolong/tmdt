import { buildInitialValues, buildValidationSchema } from "@/helpers/function.helper";
import { TResPagination } from "@/types/app.type";
import { Box, Button, Center, Drawer, Group, Modal, NumberInput, Radio, Select, Stack, TagsInput, Text, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { FormikProps, useFormik } from "formik";
import React, { ReactNode, useRef, useState } from "react";
import TableCustom, { TPayload } from "../table-custom/TableCustom";
import { useRichTextEditor } from "./hook";

export type TFieldCreate = {
   label: string;
   name: string;
   type: "text" | "number" | "select" | "date" | "custom" | "tags" | "textArea" | "edtior" | "radio";
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
   const { editor, setContent } = useRichTextEditor(undefined);

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
         const payload = { ...values };
         let formData: FormData | null = null;

         console.log({ values });
         Object.entries(payload).forEach(([key, value]) => {
            if (value instanceof File) {
               formData = new FormData();
               formData.append(key, value);
               payload[key] = formData;
            }
         });

         const editorField = creates.find((field) => field.type === "edtior");

         if (editorField) {
            payload[editorField.name] = editor?.getHTML();

            if (!payload[editorField.name]) {
               createForm.setFieldError(editorField.name, `${editorField.label} không được để trống`);
               return;
            }
         }

         console.log({ payload });

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
         <Box p={20}>
            <TableCustom<T>
               styleTableTh={{ textAlign: `center` }}
               styleTableTd={{ textAlign: `center` }}
               heightScroll={400}
               columns={columns}
               fetchData={fetchData}
               // filters={{ type: `1` }}
               onEdit={(item: any) => {
                  setEditData(item);

                  // Merge đầy đủ field
                  const fullValues = { ...createForm.initialValues, ...item };
                  createForm.setValues(fullValues);

                  // Tìm field editor và set content
                  const editorField = creates.find((field) => field.type === "edtior");
                  if (editorField && item[editorField.name]) {
                     setContent(item[editorField.name]);
                  }

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
         </Box>
         <Drawer
            position={`right`}
            opened={opened}
            onClose={() => {
               close();
               createForm.resetForm();
               setEditData(null);
               setContent("");
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
                                 setValue: (value) => {
                                    console.log({ value, field: field.name });
                                    createForm.setFieldValue(field.name, value);
                                 },
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
                              // value={(createForm.values[field.name] || []).map((item: number) => field.enum[item]).filter(Boolean)}
                              value={
                                 Array.isArray(createForm.values[field.name])
                                    ? createForm.values[field.name].map((item: number) => field.enum[item])
                                    : []
                              }
                              onChange={(e) => {
                                 createForm.setFieldValue(
                                    field.name,
                                    e.map((item: any) => field.enum[item as keyof typeof field.enum] as number)
                                 );
                              }}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     if (field.type === "edtior") {
                        return (
                           <Box key={field.name}>
                              <label>{field.label}</label>
                              <RichTextEditor key={1} editor={editor}>
                                 <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.Bold />
                                       <RichTextEditor.Italic />
                                       <RichTextEditor.Underline />
                                       <RichTextEditor.Strikethrough />
                                       <RichTextEditor.ClearFormatting />
                                       <RichTextEditor.Highlight />
                                       <RichTextEditor.Code />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.H1 />
                                       <RichTextEditor.H2 />
                                       <RichTextEditor.H3 />
                                       <RichTextEditor.H4 />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.Blockquote />
                                       <RichTextEditor.Hr />
                                       <RichTextEditor.BulletList />
                                       <RichTextEditor.OrderedList />
                                       <RichTextEditor.Subscript />
                                       <RichTextEditor.Superscript />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.Link />
                                       <RichTextEditor.Unlink />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.AlignLeft />
                                       <RichTextEditor.AlignCenter />
                                       <RichTextEditor.AlignJustify />
                                       <RichTextEditor.AlignRight />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                       <RichTextEditor.Undo />
                                       <RichTextEditor.Redo />
                                    </RichTextEditor.ControlsGroup>
                                 </RichTextEditor.Toolbar>

                                 <RichTextEditor.Content />
                              </RichTextEditor>
                           </Box>
                        );
                     }

                     if (field.type === "radio") {
                        return (
                           <Radio.Group
                              key={field.name}
                              label={field.label}
                              value={String(createForm.values[field.name])}
                              onChange={(value) => {
                                 createForm.setFieldValue(field.name, Number(value));
                              }}
                              withAsterisk={field.withAsterisk}
                           >
                              <Stack gap={10}>
                                 {field.dataTags.map((option: any) => (
                                    <Radio key={option.value} value={option.value} label={option.label} />
                                 ))}
                              </Stack>
                           </Radio.Group>
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
