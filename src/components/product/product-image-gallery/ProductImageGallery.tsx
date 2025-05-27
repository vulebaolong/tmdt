import { Carousel } from "@mantine/carousel";
import { Box } from "@mantine/core";
import { useState } from "react";
import ProductImage from "../product-image/ProductImage";

type Props = {
   images: string[];
};

export default function ProductImageGallery({ images }: Props) {
   const [activeImage, setActiveImage] = useState(images[0]);

   return (
      <Box>
         {/* Hình lớn */}
         <Box style={{ borderRadius: `10px`, overflow: `hidden`, height: "min-content" }}>
            <ProductImage src={activeImage} />
         </Box>

         <Carousel
            slideSize="20%"
            height={100}
            slideGap="xs"
            withIndicators={false}
            withControls={images.length > 5}
            mt="md"
            emblaOptions={{ align: "start" }}
         >
            {images.map((img, i) => (
               <Carousel.Slide key={i}>
                  <Box
                     sx={(theme) => {
                        return {
                           cursor: "pointer",
                           border: activeImage === img ? `2px solid ${theme.colors.spaTheme[5]}` : "2px solid transparent",
                           borderRadius: "5px",
                        };
                     }}
                     onMouseEnter={() => setActiveImage(img)}
                  >
                     <ProductImage src={img} />
                  </Box>
               </Carousel.Slide>
            ))}
         </Carousel>
      </Box>
   );
}
