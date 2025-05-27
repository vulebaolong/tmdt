import { buildInitialValues, buildValidationSchema } from "@/helpers/function.helper";
import { useFormik } from "formik";
import { useMemo } from "react";

function useDrawerForm({ editData, updates, creates, update, create, close, setEditData }: any) {
   const initialValues = useMemo(() => buildInitialValues(editData ? updates : creates), [editData, updates, creates]);
   const validationSchema = useMemo(() => buildValidationSchema(editData ? updates : creates), [editData, updates, creates]);

   return useFormik({
      initialValues: editData ? { ...initialValues, ...editData } : initialValues,
      validationSchema,
      enableReinitialize: editData ? true : false,
      onSubmit: async (values) => {
         const payload = { ...values };
         // logic xử lý payload, formData...

         if (editData) {
            update?.mutate(payload, {
               onSuccess: () => {
                  close();
                  setEditData(null);
               },
            });
         } else {
            create?.mutate(payload, {
               onSuccess: () => {
                  close();
                  setEditData(null);
               },
            });
         }
      },
   });
}

export default useDrawerForm;
