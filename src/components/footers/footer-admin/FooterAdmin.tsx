import { TITLE } from "@/constant/app.constant";
import { Center, Text } from "@mantine/core";

export default function FooterAdmin() {
   return (
      <Center h={`100%`}>
         <Text c="dimmed" ta="center" size="sm">
            © {new Date().getFullYear()} {TITLE}
         </Text>
      </Center>
   );
}
