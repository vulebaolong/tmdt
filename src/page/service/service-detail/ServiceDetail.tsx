"use client";

import NodataOverlay from "@/components/no-data/NodataOverlay";
import { descriptionSx, titleSx } from "@/components/provider/mantine/sx/text.sx";
import TextBack from "@/components/text-back/TextBack";
import { IService } from "@/schemas/service.schema";
import { Center, Container, Paper, Stack, Text } from "@mantine/core";
import classes from "./ServiceDetail.module.css";

type TProps = {
   service: IService | null;
};

export default function ServiceDetail({ service }: TProps) {
   if (!service) return <NodataOverlay visiable={!service} />;
   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Stack gap={50}>
               {/* <Title ta={`center`} size={`h1`}>{service.title}</Title> */}
               <Text
                  sx={(theme, u) => {
                     return { ...titleSx(theme, u), textAlign: `center` };
                  }}
               >
                  {service.title}
               </Text>
               <Center>
                  <Text
                     sx={(theme, u) => {
                        return { ...descriptionSx(theme, u), textAlign: `center`, maxWidth: `70%` };
                     }}
                  >
                     {service.description}
                  </Text>
               </Center>

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }} mih={300}>
                  <NodataOverlay visiable={!service} />
                  {service && <div className={`${classes[`content`]}`} dangerouslySetInnerHTML={{ __html: service.content }} />}
               </Paper>
            </Stack>
         </Stack>
      </Container>
   );
}
