"use client";
import { GoogleButton } from "@/components/buttons/GoogleButton";
import Text from "@/components/custom/text-custom/TextCustom";
import Title from "@/components/custom/title-custom/TitleCustom";
import { Logo2 } from "@/components/logo2/Logo2";
import useRouter from "@/hooks/use-router-custom";
import { TPayloadLoginGoogleAuthenticator, TStepLogin } from "@/types/auth.type";
import { Anchor, Box, Center, Divider, Group, Loader, Paper, Transition } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import classes from "./../Auth.module.css";
import LoginForm from "./login-form/LoginForm";
import LoginGoogleAuthenticator from "./login-google-authenticator/LoginGoogleAuthenticator";

export default function Login() {
   const router = useRouter();
   const [step, setStep] = useState<TStepLogin>("login-form");
   const [payloadLogin, setPayloadLogin] = useState<TPayloadLoginGoogleAuthenticator | null>(null);
   const t = useTranslations();

   return (
      <Suspense fallback={<Loader />}>
         <Box className={`${classes.wrapForm}`} style={{ animation: "fadeInUp 0.5s" }} px={`md`}>
            <Center>
               <Logo2 width={90} />
            </Center>
            <Title mt={20} ta="center" style={{ fontFamily: `Greycliff CF,   var(--mantine-font-family)`, fontWeight: `900` }}>
               Welcome back!
            </Title>

            <Group grow mb="md" mt="md">
               <GoogleButton radius="xl">Google</GoogleButton>
               {/* <FacebookButton radius="xl">Facebook</FacebookButton> */}
            </Group>

            <Divider label={t(`Or continue with email`)} labelPosition="center" my="lg" />

            <Paper
               withBorder
               shadow="md"
               p={30}
               radius="md"
               style={{
                  display: `flex`,
                  flexDirection: `column`,
                  justifyContent: `space-between`,
                  overflow: `hidden`,
               }}
            >
               <Box h={256}>
                  <Transition enterDelay={400} mounted={step === `login-form`} transition="slide-right" duration={400} timingFunction="ease">
                     {(styles) => (
                        <div style={{ ...styles, height: `100%` }}>
                           <LoginForm setStep={setStep} setPayloadLogin={setPayloadLogin} />
                        </div>
                     )}
                  </Transition>

                  <Transition
                     enterDelay={400}
                     mounted={step === `login-google-authentication`}
                     transition="slide-left"
                     duration={400}
                     timingFunction="ease"
                  >
                     {(styles) => (
                        <div style={{ ...styles, height: `100%` }}>
                           <LoginGoogleAuthenticator setStep={setStep} payloadLogin={payloadLogin} />
                        </div>
                     )}
                  </Transition>
               </Box>
            </Paper>

            <Text ta="center" mt="md">
               {t(`Don&apos;t have an account?`)}{" "}
               <Anchor<"a">
                  href="#"
                  fw={700}
                  onClick={(event) => {
                     event.preventDefault();
                     router.push("/register");
                  }}
               >
                  {t(`Register`)}
               </Anchor>
            </Text>
         </Box>
      </Suspense>
   );
}
