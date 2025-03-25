import SwitchLanguage from "@/components/test/SwitchLanguage";
import ToggleTheme from "@/components/test/ToggleTheme";
import { Stack, Text } from "@mantine/core";
import classes from "./Test.module.css";

export default function Test() {
   return (
      <Stack py={100}>
         <SwitchLanguage />
         <Text className={`${classes[`box-1`]}`}>123</Text>
         <ToggleTheme />
      </Stack>
   );
}
