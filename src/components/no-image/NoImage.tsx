import { Box, Center, Text } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

export default function NoImage() {
   return (
      <Center w={`100%`} h={`100%`}>
         <Box>
            <Center>
               <IconPhoto size={50} opacity={0.7} />
            </Center>
            <Text ta={`center`} opacity={0.7}>
               No Image
            </Text>
         </Box>
      </Center>
   );
}
