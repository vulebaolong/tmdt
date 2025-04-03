"use client";

import { Box, Text as TextMantine } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import Text from "../text-custom/TextCustom";

type TProps = {
   text: string;
};

export default function TextContent({ text }: TProps) {
   const [lineClamp, toggleLineClamp] = useToggle([3, 0]);

   return (
      <Box>
         <TextMantine style={{ overflowWrap: `break-word` }} lineClamp={lineClamp}>
            {text}
         </TextMantine>
         {(text?.length || 0) > 80 && (
            <>
               {lineClamp === 0 ? (
                  <Text
                     onClick={() => {
                        toggleLineClamp();
                     }}
                     span
                     fw={700}
                     style={{ cursor: `pointer` }}
                  >
                     Hide
                  </Text>
               ) : (
                  <Text
                     onClick={() => {
                        toggleLineClamp();
                     }}
                     span
                     fw={700}
                     style={{ cursor: `pointer` }}
                  >
                     See more
                  </Text>
               )}
            </>
         )}
      </Box>
   );
}
