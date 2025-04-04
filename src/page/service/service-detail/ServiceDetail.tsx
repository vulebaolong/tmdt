import NodataOverlay from "@/components/no-data/NodataOverlay";
import TextBack from "@/components/text-back/TextBack";
import { IService } from "@/schemas/service.schema";
import { EServiceCategory } from "@/types/enum/service.enum";
import { Badge, Center, Container, Paper, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import classes from './ServiceDetail.module.css'

type TProps = {
   service: IService | null;
};

export default function ServiceDetail({ service }: TProps) {
   const t = useTranslations();
   if (!service) return <NodataOverlay visiable={!service} />;
   return (
      <Container pt={50} pb={100}>
         <Stack>
            <TextBack />

            <Stack gap={50}>
               <Center>
                  <Badge variant="filled" size="lg">
                     {t(`Pet ${EServiceCategory[service?.category]}`)}
                  </Badge>
               </Center>

               <Title ta={`center`} size={`h1`}>{service.title}</Title>

               <Paper pos={`relative`} shadow="md" radius="lg" withBorder p="xl" style={{ overflow: `hidden` }} mih={300}>
                  <NodataOverlay visiable={!service} />
                  {service && <div className={`${classes[`content`]}`} dangerouslySetInnerHTML={{ __html: service.content }} />}
               </Paper>
            </Stack>
         </Stack>
      </Container>
   );
}
