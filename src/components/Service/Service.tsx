"use client";

import { Badge, Box, Card, Group, SimpleGrid, Text, Title, useMantineTheme } from "@mantine/core";
import { IconHeartSearch, IconHomeHeart, IconScissors } from "@tabler/icons-react";
import classes from "./Service.module.css";

const mockdata = [
   {
      title: "Pet Grooming",
      description: "Professional care & grooming services to keep your pets clean, healthy, and beautiful every day.",
      icon: IconScissors,
   },
   {
      title: "Pet Hotel",
      description: "A safe, cozy, and friendly place where your pets can stay while you're away.",
      icon: IconHomeHeart,
   },
   {
      title: "Pet Rescue",
      description: "Emergency rescue service for abandoned or lost pets. We care, we save, we protect.",
      icon: IconHeartSearch,
   },
];

export function Service() {
   const theme = useMantineTheme();
   const features = mockdata.map((feature) => (
      <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
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
               Pet Service
            </Badge>
         </Group>

         <Title order={2} className={classes.title} ta="center" mt="sm">
            Dịch vụ thú cưng chuyên nghiệp & tận tâm
         </Title>

         <Text c="dimmed" className={classes.description} ta="center" mt="md">
            Chúng tôi cung cấp đa dạng dịch vụ dành cho thú cưng như Chăm sóc - Làm đẹp, Khách sạn thú cưng và Cứu hộ thú cưng. Đảm bảo an toàn, tiện
            lợi và yêu thương cho thú cưng của bạn mọi lúc mọi nơi.
         </Text>

         <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
            {features}
         </SimpleGrid>
      </Box>
   );
}
