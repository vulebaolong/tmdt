import { Box } from "@mantine/core";
import { Fragment } from "react";
import BlogItem from "./BlogItem";

type TProps = {
   listBlog: {
      title: string;
      description: string;
      img: string;
   }[];
};

export default function BlogList({ listBlog }: TProps) {
   return (
      <Box
         sx={{
            display: `grid`,
            gap: 20,
            gridTemplateColumns: "1fr 1fr 1fr",
         }}
      >
         {listBlog.map((blog, i) => (
            <Fragment key={i}>
               <BlogItem blog={blog} />
            </Fragment>
         ))}
      </Box>
   );
}
