import { Stack, Text } from "@mantine/core";
import IconEmpty from "../icons/IconEmty";

export default function Nodata() {
   return (
      <Stack align="center" opacity={0.7}>
         <IconEmpty />
         <Text style={{ textAlign: `center` }}>No data</Text>
      </Stack>
   );
}
