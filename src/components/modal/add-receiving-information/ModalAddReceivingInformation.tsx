import { TUpdateProfile } from "@/actions/user.action";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { useAppSelector } from "@/redux/hooks";
import { useUpdateProfile } from "@/tantask/user.tantack";
import { Box, Button, Modal, Stack, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import * as Yup from "yup";

type TProps = {
   opened: boolean;
   close: () => void;
   onSuccess?: () => void;
};

export default function ModalAddReceivingInformation({ opened, close, onSuccess }: TProps) {
   const toast = useAppToast();
   const updateProfile = useUpdateProfile();
   const id = useAppSelector((state) => state.user.info?._id);
   const phone = useAppSelector((state) => state.user.info?.phone);
   const address = useAppSelector((state) => state.user.info?.address);

   const addReceivingForm = useFormik({
      enableReinitialize: true,
      initialValues: {
         phone: phone || ``,
         address: address || ``,
      },
      validationSchema: Yup.object().shape({
         phone: Yup.string()
            .trim()
            .required("Vui lòng nhập số điện thoại")
            .matches(/^\d{8,15}$/, "Số điện thoại không hợp lệ"),
         address: Yup.string().trim().required(),
      }),
      onSubmit: async (valuesRaw) => {
         if (!id) return toast.warning(`Chưa đăng nhập`);
         const payload: TUpdateProfile = {
            userId: id.toString(),
            phone: valuesRaw.phone.trim(),
            address: valuesRaw.address.trim(),
         };

         if (payload.phone === phone && payload.address === address) {
            close();
            return;
         }

         updateProfile.mutate(payload, {
            onSuccess: () => {
               close();
               addReceivingForm.resetForm();
               if (onSuccess) onSuccess();
            },
         });
      },
   });

   return (
      <Modal opened={opened} onClose={close} title="Receiving Information">
         <Box component="form" onSubmit={addReceivingForm.handleSubmit}>
            <Stack>
               <TextInput
                  withAsterisk
                  label="Số điện thoại"
                  placeholder="Số điện thoại"
                  name="phone"
                  value={addReceivingForm.values.phone}
                  onChange={addReceivingForm.handleChange}
                  error={
                     addReceivingForm.touched.phone && typeof addReceivingForm.errors.phone === "string" ? addReceivingForm.errors.phone : undefined
                  }
                  inputWrapperOrder={["label", "input", "error"]}
                  style={{ height: `85px` }}
               />
               <TextInput
                  withAsterisk
                  label="Địa chỉ nhận hàng"
                  placeholder="Địa chỉ nhận hàng"
                  name="address"
                  value={addReceivingForm.values.address}
                  onChange={addReceivingForm.handleChange}
                  error={
                     addReceivingForm.touched.address && typeof addReceivingForm.errors.address === "string"
                        ? addReceivingForm.errors.address
                        : undefined
                  }
                  inputWrapperOrder={["label", "input", "error"]}
                  style={{ height: `85px` }}
               />

               <Button loading={updateProfile.isPending} type="submit" fullWidth style={{ flexShrink: `0` }}>
                  Save
               </Button>
            </Stack>
         </Box>
      </Modal>
   );
}
