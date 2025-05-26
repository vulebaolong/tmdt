import { Carousel } from "@mantine/carousel";
import BlogItem from "./BlogItem";

type TProps = {
   listBlog: {
      title: string;
      description: string;
      img: string;
   }[];
};

export default function BlogCarousel({ listBlog }: TProps) {
   return (
      <Carousel
         withIndicators
         withControls={false}
         slideSize={{ base: "100%" }}
         slideGap={{ base: 0 }}
         emblaOptions={{ loop: true, align: "start" }}
         styles={(theme) => {
            return {
               indicator: {
                  zIndex: 5,
                  background: `white`,
                  border: `1px solid ${theme.colors.spaTheme[5]}`,
                  width: `12px`,
                  height: `12px`,
                  transition: "all 0.3s ease",

                  "&[data-active]": {
                     background: theme.colors.spaTheme[5],
                     border: `1px solid ${theme.colors.spaTheme[5]}`,
                     width: `12px`,
                     height: `12px`,
                     transition: "all 0.3s ease",
                  },
               },
            };
         }}
      >
         {listBlog.map((blog, i) => {
            return (
               <Carousel.Slide key={i}>
                  <BlogItem blog={blog} />
               </Carousel.Slide>
            );
         })}
      </Carousel>
   );
}
