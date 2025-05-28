"use client";

import ROUTER_CLIENT from "@/constant/router.constant";
import { EServiceCategory } from "@/types/enum/service.enum";
import { Badge, Box, Card, Center, SimpleGrid, useMantineTheme } from "@mantine/core";
import { IconHeartSearch, IconHomeHeart, IconScissors } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import useRouter from "@/hooks/use-router-custom";
import Text from "../custom/text-custom/TextCustom";
import Title from "../custom/title-custom/TitleCustom";
import classes from "./Service.module.css";

const descriptions = {
   [EServiceCategory.Grooming]: "Professional care & grooming services to keep your pets clean, healthy, and beautiful every day",
   [EServiceCategory.Hotel]: "A safe, cozy, and friendly place where your pets can stay while you're away",
   [EServiceCategory.Rescue]: "Emergency rescue service for abandoned or lost pets, we care, we save, we protect",
};

const icons = {
   [EServiceCategory.Grooming]: IconScissors,
   [EServiceCategory.Hotel]: IconHomeHeart,
   [EServiceCategory.Rescue]: IconHeartSearch,
};

const mockdata = Object.entries(EServiceCategory)
   .filter(([, value]) => !isNaN(Number(value)))
   .map(([key, value]) => {
      const enumKey = Number(value) as EServiceCategory;
      return {
         category: enumKey,
         title: key,
         description: descriptions[enumKey],
         icon: icons[enumKey],
      };
   });

export function Service() {
   const theme = useMantineTheme();
   const t = useTranslations();
   const router = useRouter();

   return (
      <Box>
         <Center>
            <Badge variant="filled" size="lg">
               {t(`Pet Service`)}
            </Badge>
         </Center>

         <Title order={2} className={classes.title} ta="center" mt="sm">
            Professional & Dedicated Pet Service
         </Title>

         <Text c="dimmed" className={classes.description} ta="center" mt="md">
            We provide
         </Text>

         <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
            {mockdata.map((feature) => {
               return (
                  <Card
                     onClick={() => {
                        router.push(`${ROUTER_CLIENT.SERVICE}?category=${feature.category}`);
                     }}
                     key={feature.title}
                     shadow="md"
                     radius="md"
                     className={classes.card}
                     padding="xl"
                  >
                     <feature.icon size={50} stroke={2} color={theme.colors.spaTheme[5]} />
                     <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                        {feature.title}
                     </Text>
                     <Text fz="sm" c="dimmed" mt="sm">
                        {feature.description}
                     </Text>
                  </Card>
               );
            })}
         </SimpleGrid>
      </Box>
   );
}
