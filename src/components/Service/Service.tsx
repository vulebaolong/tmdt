"use client";

import { Badge, Box, Card, Group, SimpleGrid, useMantineTheme } from "@mantine/core";
import { IconHeartSearch, IconHomeHeart, IconScissors } from "@tabler/icons-react";
import classes from "./Service.module.css";
import Text from "../text-custom/TextCustom";
import Title from "../title-custom/TitleCustom";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ROUTER from "@/constant/router.constant";

const mockdata = [
   {
      title: "Pet Grooming",
      description: "Professional care & grooming services to keep your pets clean, healthy, and beautiful every day",
      icon: IconScissors,
   },
   {
      title: "Pet Hotel",
      description: "A safe, cozy, and friendly place where your pets can stay while you're away",
      icon: IconHomeHeart,
   },
   {
      title: "Pet Rescue",
      description: "Emergency rescue service for abandoned or lost pets, we care, we save, we protect",
      icon: IconHeartSearch,
   },
];

export function Service() {
   const theme = useMantineTheme();
   const t = useTranslations();
   const router = useRouter();
   const features = mockdata.map((feature) => (
      <Card
         onClick={() => {
            router.push(ROUTER.SERVICE);
         }}
         key={feature.title}
         shadow="md"
         radius="md"
         className={classes.card}
         padding="xl"
      >
         <feature.icon size={50} stroke={2} color={theme.colors.blue[6]} />
         <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
            {feature.title}
         </Text>
         <Text fz="sm" c="dimmed" mt="sm">
            {feature.description}
         </Text>
      </Card>
   ));

   return (
      <Box>
         <Group justify="center">
            <Badge variant="filled" size="lg">
               {t(`Pet Service`)}
            </Badge>
         </Group>

         <Title order={2} className={classes.title} ta="center" mt="sm">
            Professional & Dedicated Pet Service
         </Title>

         <Text c="dimmed" className={classes.description} ta="center" mt="md">
            We provide
         </Text>

         <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
            {features}
         </SimpleGrid>
      </Box>
   );
}
