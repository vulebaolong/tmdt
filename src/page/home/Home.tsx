import { Box, Container } from "@mantine/core";
import classes from "./Home.module.css";

export default function Home() {
   return (
      <Container>
         <Box my={100}>
            <Box className={`${classes[`box-container`]}`} p={20}>
               <Box className={`${classes[`box-item`]}`}>{`<HomeLeft />`}</Box>

               <Box className={`${classes[`box-center`]}`}>{`<HomeCenter />`}</Box>

               <Box className={`${classes[`box-item`]}`}>{`<HomeRight />`}</Box>
            </Box>
         </Box>
      </Container>
   );
}
