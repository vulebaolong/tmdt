"use client";
import CustomPasswordInput, { validatePassword } from "@/components/password-input/CustomPasswordInput";
import CustomRePasswordInput from "@/components/password-input/CustomRePasswordInput";
import { useAppToast } from "@/components/provider/toast/Toasti18n";
import { useRegister } from "@/tantask/auth.tanstack";
import { Anchor, Box, Button, Center, Paper, Stack, TextInput, useMantineTheme } from "@mantine/core";
import { useFormik } from "formik";
import useRouter from "@/hooks/use-router-custom";
import { Suspense } from "react";
import * as Yup from "yup";
import classes from "./../Auth.module.css";
import Text from "@/components/custom/text-custom/TextCustom";
import { useTranslations } from "next-intl";
import Title from "@/components/custom/title-custom/TitleCustom";
import { LogoIcon } from "@/components/logo/LogoIcon";

export default function Register() {
   const toast = useAppToast();
   const router = useRouter();
   const theme = useMantineTheme();
   const register = useRegister();
   const t = useTranslations();

   const registerForm = useFormik({
      initialValues: {
         fullName: "",
         email: "",
         password: "",
         rePassword: "",
         // fullName: "long",
         // email: "long@gmail.com",
         // password: "aA@123",
         // rePassword: "aA@123",
      },
      validationSchema: Yup.object().shape({
         fullName: Yup.string().trim().required(t("Username is required")),
         email: Yup.string().trim().email().required(t("Email is required")),
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
         rePassword: Yup.string()
            .trim()
            .required(t("Re-enter Password is required"))
            .test("password-is-valid", t("Password must be valid before matching"), function () {
               const { password } = this.parent;
               return validatePassword.every((rule) => rule.re.test(password || ""));
            })
            .test("passwords-match", t("Passwords must match"), function (value) {
               const { password } = this.parent;
               return value === password;
            }),
      }),
      onSubmit: async (valuesRaw) => {
         const payload = {
            fullName: valuesRaw.fullName.trim(),
            email: valuesRaw.email.trim(),
            password: valuesRaw.password.trim(),
         };

         console.log({ payload });

         register.mutate(payload, {
            onSuccess: (data) => {
               console.log({ data });
               router.push("/login");
               toast.success(`Register successfully`);
            },
         });
      },
   });

   return (
      <Suspense fallback={<p>Loading feed...</p>}>
         <Stack className={`${classes.wrapForm}`} style={{ animation: "fadeInUp 0.5s" }} px={`md`}>
            <Center>
               <LogoIcon />
            </Center>

            <Title ta="center" style={{ fontFamily: `Greycliff CF,   var(--mantine-font-family)`, fontWeight: `900` }}>
               Register!
            </Title>

            <Paper
               withBorder
               shadow="md"
               p={30}
               radius="md"
               style={{
                  display: `flex`,
                  flexDirection: `column`,
                  justifyContent: `space-between`,
               }}
               component="form"
               onSubmit={(e) => {
                  e.preventDefault();
                  registerForm.handleSubmit();
               }}
            >
               <Box>
                  <TextInput
                     withAsterisk
                     label={t("Full name")}
                     placeholder={t("Full name")}
                     name="fullName"
                     value={registerForm.values.fullName}
                     onChange={registerForm.handleChange}
                     error={registerForm.touched.fullName && registerForm.errors.fullName}
                     inputWrapperOrder={["label", "input", "error"]}
                     style={{ height: `85px` }}
                  />

                  <TextInput
                     withAsterisk
                     label="Email"
                     placeholder="email"
                     name="email"
                     value={registerForm.values.email}
                     onChange={registerForm.handleChange}
                     error={registerForm.touched.email && registerForm.errors.email}
                     inputWrapperOrder={["label", "input", "error"]}
                     style={{ height: `85px` }}
                  />

                  <Box style={{ height: `85px` }}>
                     <CustomPasswordInput
                        label={t("Password")}
                        placeholder={t("Your password")}
                        withAsterisk
                        name="password"
                        value={registerForm.values.password}
                        onChange={registerForm.handleChange}
                        error={registerForm.touched.password && registerForm.errors.password}
                        inputWrapperOrder={["label", "input", "error"]}
                     />
                  </Box>

                  {/* re-password */}
                  <Box style={{ height: `85px` }}>
                     <CustomRePasswordInput
                        rePassword={registerForm.values.rePassword}
                        password={registerForm.values.password}
                        label={t(`Re-enter password`)}
                        placeholder={t(`Your password`)}
                        withAsterisk
                        name="rePassword"
                        value={registerForm.values.rePassword}
                        onChange={registerForm.handleChange}
                        inputWrapperOrder={["label", "input", "error"]}
                        error={registerForm.touched.rePassword && registerForm.errors.rePassword}
                        className={classes.input}
                     />
                  </Box>
               </Box>
               <Button color={theme.colors.shopee[5]} loading={register.isPending} type="submit" fullWidth style={{ flexShrink: `0` }}>
                  {t(`Register`)}
               </Button>
            </Paper>

            <Text ta="center">
               {t(`Already have an account?`)}{" "}
               <Anchor<"a">
                  href="#"
                  fw={700}
                  onClick={(event) => {
                     event.preventDefault();
                     router.push("/login");
                  }}
               >
                  {t(`Login`)}
               </Anchor>
            </Text>
         </Stack>
      </Suspense>
   );
}
