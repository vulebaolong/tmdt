import { Stack, Text } from "@mantine/core";
import IconEmpty from "../icons/IconEmty";

export default function Nodata() {
   return (
      <Stack align="center">
         <IconEmpty />
         <Text style={{ textAlign: `center` }}>No data</Text>
      </Stack>
   );
}
