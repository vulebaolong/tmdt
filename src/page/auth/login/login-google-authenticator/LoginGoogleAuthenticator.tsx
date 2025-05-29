"use client";

import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useLoginGoogleAuthenticator } from "@/tantask/auth.tanstack";
import { TPayloadLoginGoogleAuthenticator, TStepLogin } from "@/types/auth.type";
import { Anchor, Box, Button, Center, Group, PinInput, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   setStep: Dispatch<SetStateAction<TStepLogin>>;
   payloadLogin: TPayloadLoginGoogleAuthenticator | null;
};

export default function LoginGoogleAuthenticator({ setStep, payloadLogin }: TProps) {
   const loginGoogleAuthenticator = useLoginGoogleAuthenticator();
   const router = useRouter();

   const loginGoogleAuthenticatorForm = useFormik({
      initialValues: {
         token: "",
      },
      validationSchema: Yup.object().shape({
         token: Yup.string().trim().required("Code is required."),
      }),
      onSubmit: async (valuesRaw: any) => {
         let payload: TPayloadLoginGoogleAuthenticator = {};

         if (payloadLogin?.password) {
            // trường hợp login password với google authenticator
            if (!payloadLogin) return toast.warning(`Please go back login`);
            if (!payloadLogin.email) return toast.warning(`Please go back login`);
            if (!payloadLogin.password) return toast.warning(`Please go back login`);

            const { email, password } = payloadLogin;

            payload = {
               email,
               password,
               token: valuesRaw.token,
            };
         } else {
            // trường hợp login google với google authenticator
            if (!payloadLogin?.tokensGoogle) return toast.warning(`Provide the code`);
            payload = {
               tokensGoogle: payloadLogin.tokensGoogle,
               token: valuesRaw.token,
            };
         }

         console.log({ payload });

         try {
            loginGoogleAuthenticator.mutate(payload, {
               onSuccess: () => {
                  router.push(ROUTER_CLIENT.HOME);
                  toast.success(`Login successfully`);
               },
            });
         } catch (error) {
            console.error(error);
         }
      },
   });
   return (
      <Box
         component="form"
         onSubmit={(e) => {
            e.preventDefault();
            loginGoogleAuthenticatorForm.handleSubmit();
         }}
      >
         <Stack h={200}>
            <Group justify="space-between">
               <Anchor
                  onClick={() => {
                     setStep(`login-form`);
                  }}
                  c="dimmed"
                  size="sm"
               >
                  <Center inline>
                     <IconArrowLeft style={{ width: "12px", height: "12px" }} stroke={1.5} />
                     <Box ml={5}>Back to login</Box>
                  </Center>
               </Anchor>
            </Group>
            <Title order={4} ta={`center`}>
               Google Authenticator
            </Title>
            <Text c={`dimmed`} ta={`center`}>
               Enter the code displayed in your authenticator app
            </Text>
            <Box>
               <Center>
                  <PinInput
                     length={6}
                     name="token"
                     value={loginGoogleAuthenticatorForm.values.token}
                     onChange={(e) => {
                        loginGoogleAuthenticatorForm.setFieldValue(`token`, e);
                     }}
                     error={!!(loginGoogleAuthenticatorForm.touched.token && loginGoogleAuthenticatorForm.errors.token)}
                  />
               </Center>
               <Center>
                  <Text
                     c={`var(--input-asterisk-color, var(--mantine-color-error))`}
                     style={{
                        fontSize: `var(--input-error-size, calc(var(--mantine-font-size-sm) - calc(0.125 * var(--mantine-scale))))`,
                     }}
                  >
                     {loginGoogleAuthenticatorForm.errors.someField && typeof loginGoogleAuthenticatorForm.errors.someField === "string"
                        ? loginGoogleAuthenticatorForm.errors.someField
                        : null}
                  </Text>
               </Center>
            </Box>
         </Stack>
         <Button mt={20} loading={false} type="submit" fullWidth style={{ flexShrink: `0` }}>
            Verify
         </Button>
      </Box>
   );
}
