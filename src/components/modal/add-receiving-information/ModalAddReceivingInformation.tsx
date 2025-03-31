import { TUpdateProfile } from "@/actions/user.action";
import { useAppSelector } from "@/redux/hooks";
import { useUpdateProfile } from "@/tantask/user.tantack";
import { Box, Button, Modal, Stack, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   opened: boolean;
   close: () => void;
};

export default function ModalAddReceivingInformation({ opened, close }: TProps) {
   const updateProfile = useUpdateProfile();
   const id = useAppSelector((state) => state.user.info?._id);

   const addReceivingForm = useFormik({
      initialValues: {
         phone: ``,
         address: ``,
      },
      validationSchema: Yup.object().shape({
         phone: Yup.string().trim().required(),
         address: Yup.string().trim().required(),
      }),
      onSubmit: async (valuesRaw) => {
         if (!id) return toast.warning(`Chưa đăng nhập`);
         const payload: TUpdateProfile = {
            userId: id.toString(),
            phone: valuesRaw.phone.trim(),
            address: valuesRaw.address.trim(),
         };

         updateProfile.mutate(payload, {
            onSuccess: () => {
               close();
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
