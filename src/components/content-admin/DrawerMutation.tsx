import { buildInitialValues, buildValidationSchema } from "@/helpers/function.helper";
import { useIsMobile } from "@/hooks/is-mobile.hook";
import { Box, Button, Drawer, NumberInput, Radio, Select, Stack, TagsInput, Textarea, TextInput } from "@mantine/core";
import { UseMutationResult } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import CustomPasswordInput from "../password-input/CustomPasswordInput";
import { TFieldCreate } from "./ContentAdmin";
import TextEditor from "./TextEditor";

type TProps = {
   editData: any;
   updates: TFieldCreate[];
   creates: TFieldCreate[];
   update: UseMutationResult<any, Error, any, unknown> | null;
   create: UseMutationResult<any, Error, any, unknown> | null;
   setEditData: React.Dispatch<React.SetStateAction<null>>;
   opened: boolean;
   close: () => void;
};

export default function DrawerMutation({ editData, updates, creates, update, create, setEditData, opened, close }: TProps) {
   const isMobile = useIsMobile();

   useEffect(() => {
      // Merge đầy đủ field
      console.log({ editData });
      const fullValues = { ...createForm.initialValues, ...editData };
      console.log({ fullValues });
      createForm.setValues(fullValues);

      // // Tìm field editor và set content
      // const editorField = creates.find((field) => field.type === "editor");
      // if (editorField && editData && editData[editorField.name]) {
      //    setContent(editData[editorField.name]);
      // }
   }, [editData]);


   const initialValues = useMemo(() => buildInitialValues(editData ? updates : creates), [editData, updates, creates]);
   const validationSchema = useMemo(() => buildValidationSchema(editData ? updates : creates), [editData, updates, creates]);
   const createForm = useFormik({
      initialValues,
      validationSchema,
      enableReinitialize: true,
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

         console.log({ payload });

         if (editData) {
            if (!update) return;
            update.mutate(payload, {
               onSuccess: () => {
                  close();
                  createForm.resetForm();
                  // setContent("");
               },
            });
         } else {
            if (!create) return;
            create.mutate(payload, {
               onSuccess: () => {
                  close();
                  createForm.resetForm();
                  // setContent("");
               },
            });
         }
      },
   });


   return (
      <Drawer
         position={`right`}
         opened={opened}
         onClose={() => {
            close();
            createForm.resetForm();
            setEditData(null);

            // // Delay để đợi Formik và custom components re-render trước
            // setTimeout(() => {
            //    console.log(123);
            //    resetEditor(); // đây sẽ setEditorKey mới và mount lại editor
            // }, 50);
         }}
         title={editData ? "Update" : "Create"}
         size={isMobile ? `90%` : `50%`}
      >
         <form onSubmit={createForm.handleSubmit}>
            <Stack>
               {(editData ? updates : creates).map((field) => {
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

                  if (field.type === "password") {
                     return (
                        <CustomPasswordInput
                           key={field.name}
                           label={field.label}
                           placeholder={field.placeholder || field.label}
                           withAsterisk={field.withAsterisk}
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
                           data={field.dataSelect}
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
                                 ? createForm.values[field.name].map((item: number) => field.enum?.[item])
                                 : []
                           }
                           error={error}
                           onChange={(e) => {
                              createForm.setFieldValue(
                                 field.name,
                                 e.map((item: any) => field.enum?.[item as keyof typeof field.enum] as number)
                              );
                           }}
                           inputWrapperOrder={["label", "input", "error"]}
                           {...field?.props}
                        />
                     );
                  }

                  if (field.type === "editor") {
                     return (
                        <Box key={field.name}>
                           <label>{field.label}</label>
                           <TextEditor
                              value={createForm.values[field.name]}
                              onUpdate={(value) => {
                                 createForm.setFieldValue(field.name, value.editor.getHTML());
                              }}
                           />
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
                              {field.dataRadios?.map((option: any) => (
                                 <Radio key={option.value} value={option.value} label={option.label} />
                              ))}
                           </Stack>
                        </Radio.Group>
                     );
                  }

                  return null;
               })}
               <Button loading={update?.isPending || create?.isPending} type="submit">
                  Save
               </Button>
            </Stack>
         </form>
      </Drawer>
   );
}
