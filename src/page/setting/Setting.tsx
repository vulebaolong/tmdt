"use client";

import TextBack from "@/components/text-back/TextBack";
import { Container, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import SettingAccount from "./SettingAccount";
import SettingAppearance from "./SettingAppearance";
import SettingGoogleAuthenticator from "./SettingGoogleAuthenticator";

export default function Setting() {
   const t = useTranslations("setting");

   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Stack gap={50}>
               <Title
                  order={2}
                  ta="center"
                  mt="sm"
                  sx={{
                     fontWeight: 900,
                     fontSize: `clamp(28px, 4vw, 34px)`,
                  }}
               >
                  {t(`General Settings`)}
               </Title>

               <Stack>
                  <SettingAccount />
                  <SettingAppearance />
                  <SettingGoogleAuthenticator />
               </Stack>
            </Stack>
         </Stack>
      </Container>
   );
}
