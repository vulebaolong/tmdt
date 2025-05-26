"use client";

import ROUTER_CLIENT from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { Carousel } from "@mantine/carousel";
import { Box, Button, Container, Overlay, Stack } from "@mantine/core";
import Image from "next/image";
import Text from "../custom/text-custom/TextCustom";
import Title from "../custom/title-custom/TitleCustom";

export default function Banner() {
   const router = useRouter();

   const images = ["/banner/carousel_dog1.webp", "/banner/carousel_dog2.webp", "/banner/carousel_dog3.webp"];

   return (
      <Box pos={`relative`}>
         <Carousel withIndicators height={`70vh`} withControls={false} slideGap="md" emblaOptions={{ loop: true, align: "center" }} slideSize="100%">
            {images.map((src, i) => (
               <Carousel.Slide key={i} pos={`relative`}>
                  <Overlay gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)" opacity={0.5} zIndex={0} />
                  <Image
                     src={src}
                     alt={`Banner ${i + 1}`}
                     width={1200}
                     height={500}
                     priority
                     style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                     }}
                  />
               </Carousel.Slide>
            ))}
         </Carousel>
         <Box style={{ position: `absolute`, top: 0, left: 0, width: `100%` }}>
            <Container pos={`relative`}>
               <Stack pt={`10%`}>
                  <Title c={`white`} maw={`70%`}>
                     A fully featured React components library
                  </Title>
                  <Text c={`white`} size="xl" mt="xl" maw={`70%`}>
                     Build fully 2
                  </Text>

                  <Button
                     onClick={() => {
                        router.push(ROUTER_CLIENT.LOGIN);
                     }}
                     variant="gradient"
                     color={`shopee`}
                     size="lg"
                     radius="xl"
                     w={150}
                     gradient={{ from: "red", to: "orange", deg: 79 }}
                  >
                     Get started
                  </Button>
               </Stack>
            </Container>
         </Box>
      </Box>
   );
}
