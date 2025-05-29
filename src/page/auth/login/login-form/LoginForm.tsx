"use client";

import CustomPasswordInput, { validatePassword } from "@/components/password-input/CustomPasswordInput";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { useLoginForm } from "@/tantask/auth.tanstack";
import { TPayloadLoginGoogleAuthenticator, TStepLogin } from "@/types/auth.type";
import { Anchor, Box, Button, Group, TextInput, useMantineTheme } from "@mantine/core";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";

type TProps = {
   setStep: Dispatch<SetStateAction<TStepLogin>>;
   setPayloadLogin: Dispatch<SetStateAction<TPayloadLoginGoogleAuthenticator | null>>;
};

export default function LoginForm({ setStep, setPayloadLogin }: TProps) {
   const toast = useAppToast();
   const router = useRouter();
   const theme = useMantineTheme();
   const t = useTranslations();

   const useloginForm = useLoginForm();

   const loginForm = useFormik({
      initialValues: {
         // email: `long@gmail.com`,
         // password: `aA@123`,
         email: ``,
         password: ``,
      },
      validationSchema: Yup.object().shape({
         email: Yup.string().trim().email(t("Email is invalid")).required(t("Email is required")),
         password: Yup.string()
            .trim()
            .required(t("Password is required"))
            .test("includes-number", t("Password must contain at least one number"), (value) => {
               if (!value) return false;
               return validatePassword[0].re.test(value);
            })
            .test("includes-lowercase", t("Password must contain a lowercase letter"), (value) => {
               if (!value) return false;
               return validatePassword[1].re.test(value);
            })
            .test("includes-uppercase", t("Password must contain an uppercase letter"), (value) => {
               if (!value) return false;
               return validatePassword[2].re.test(value);
            })
            .test("includes-special-symbol", t("Password must contain a special character"), (value) => {
               if (!value) return false;
               return validatePassword[3].re.test(value);
            })
            .test("includes-6-characters", t("Password must be at least 6 characters"), (value) => {
               if (!value) return false;
               return validatePassword[4].re.test(value);
            }),
      }),
      onSubmit: async (valuesRaw) => {
         const payload = {
            email: valuesRaw.email.trim(),
            password: valuesRaw.password.trim(),
         };
         setPayloadLogin({
            ...payload,
         });
         useloginForm.mutate(payload, {
            onSuccess: (data) => {
               console.log({ data });
               if (data.isGoogleAuthenticator) {
                  setStep(`login-google-authentication`);
               } else {
                  router.push(ROUTER_CLIENT.HOME);
                  toast.success(`Login successfully`);
               }
            },
         });
      },
   });

   return (
      <Box component="form" onSubmit={loginForm.handleSubmit}>
         <Box h={200}>
            <TextInput
               withAsterisk
               label="Email"
               placeholder="Email"
               name="email"
               value={loginForm.values.email}
               onChange={loginForm.handleChange}
               error={loginForm.touched.email && typeof loginForm.errors.email === "string" ? loginForm.errors.email : undefined}
               inputWrapperOrder={["label", "input", "error"]}
               style={{ height: `85px` }}
            />

            <Box style={{ height: `85px` }}>
               <CustomPasswordInput
                  label={t(`Password`)}
                  placeholder={t(`Your password`)}
                  withAsterisk
                  name="password"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  error={loginForm.touched.password && typeof loginForm.errors.password === "string" ? loginForm.errors.password : undefined}
                  inputWrapperOrder={["label", "input", "error"]}
               />
            </Box>
            <Group justify="end">
               <Anchor
                  onClick={() => {
                     router.push("/forgot-pass");
                  }}
                  type="button"
                  component="button"
                  size="sm"
               >
                  {t(`Forgot password?`)}
               </Anchor>
            </Group>
         </Box>

         <Button color={theme.colors.spaTheme[5]} mt={10} loading={useloginForm.isPending} type="submit" fullWidth style={{ flexShrink: `0` }}>
            {t(`Login`)}
         </Button>
      </Box>
   );
}
