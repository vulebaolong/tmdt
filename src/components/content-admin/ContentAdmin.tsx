import { buildInitialValues, buildValidationSchema } from "@/helpers/function.helper";
import { TResPagination } from "@/types/app.type";
import { Box, Button, Drawer, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import TableCustom, { TPayload } from "../table-custom/TableCustom";

export type TFieldCreate = {
   label: string;
   name: string;
   type: "text" | "number" | "select" | "date" | "custom";
   options?: string[];
   withAsterisk?: boolean;
   component?: (props: { value: any; error: string | undefined; setValue: (value: any) => void }) => React.ReactElement;
};

type TProps<T> = {
   columns: any;
   creates: TFieldCreate[];
   onCreate: () => UseMutationResult<any, Error, any, unknown>;
   fetchData: (payload: TPayload) => UseQueryResult<TResPagination<T>>;
   title: string;
};

export default function ContentAdmin<T>({ columns, creates, onCreate, title = `Create New`, fetchData }: TProps<T>) {
   const [opened, { open, close }] = useDisclosure(false);

   const create = onCreate();

   const initialValues = buildInitialValues(creates);
   const validationSchema = buildValidationSchema(creates);

   const createForm = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
         create.mutate(values, {
            onSuccess: () => {
               toast.success(`Create success`);
               close();
               createForm.resetForm();
            },
            onError: (error) => {
               toast.error(error.message);
            },
         });
      },
   });

   return (
      <>
         <Box px={20}>
            <Button variant="filled" onClick={open}>
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
         />
         <Drawer
            position={`right`}
            // size={`50%`}
            opened={opened}
            onClose={() => {
               close();
               createForm.resetForm();
            }}
            title={title}
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
                              })}
                           </Box>
                        );
                     }

                     if (field.type === "text") {
                        return (
                           <TextInput
                              key={field.name}
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
                           />
                        );
                     }

                     if (field.type === "select") {
                        return (
                           <Select
                              key={field.name}
                              withAsterisk={field.withAsterisk}
                              label={field.label}
                              name={field.name}
                              data={field.options || []}
                              value={createForm.values[field.name]}
                              onChange={(value) => createForm.setFieldValue(field.name, value)}
                              error={error}
                              inputWrapperOrder={["label", "input", "error"]}
                           />
                        );
                     }

                     return null;
                  })}
                  <Button type="submit">Save</Button>
               </Stack>
            </form>
         </Drawer>
      </>
   );
}
