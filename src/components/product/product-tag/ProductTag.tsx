import { EProductTag } from "@/types/enum/product.enum";
import { Text } from "@mantine/core";

type TProps = {
   tag: number;
};

function ProductTag({ tag }: TProps) {
   if (tag === 1) {
      return (
         <Text style={{ outline: `1px solid red`, padding: `2px 5px`, width: `fit-content`, fontWeight: 900 }} fz={8} c={`red`}>
            {EProductTag[tag]}
            Rẻ Vô Định
         </Text>
      );
   }
   return (
      <Text style={{ backgroundColor: `rgba(246,145,19)`, padding: `2px 5px`, width: `fit-content`, fontWeight: 900 }} fz={8} c={`white`}>
         50% Giảm
      </Text>
   );
}

export default ProductTag;
