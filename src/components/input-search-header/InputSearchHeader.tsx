import ROUTER from "@/constant/router.constant";
import { renderData } from "@/helpers/function.helper";
import { useGetProductList } from "@/tantask/product.tanstack";
import { Button, Group, Input, LoadingOverlay, Popover, Stack, Text, useMantineTheme } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import NodataOverlay from "../no-data/NodataOverlay";
import ProductImage from "../product/product-image/ProductImage";
import classes from "./InputSearchHeader.module.css";
import useRouter from "@/hooks/use-router-custom";
import { useTranslations } from "next-intl";

export default function InputSearchHeader() {
   const theme = useMantineTheme();
   const [opened, setOpened] = useState(false);
   const router = useRouter();
   const t = useTranslations()

   const getProductList = useGetProductList();

   const handleSearch = useDebouncedCallback(async (query: string) => {
      if (!query.trim()) return;
      getProductList.mutate({ page: 1, category: undefined, searchProduct: query });
      setOpened(() => true);
   }, 500);

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(event.currentTarget.value);
   };

   return (
      <Popover opened={opened} onChange={setOpened} width="target" position="bottom" offset={5} shadow="md">
         <Popover.Target>
            <Group
               style={{
                  width: `100%`,
                  backgroundColor: `white`,
                  borderRadius: `var(--mantine-radius-md)`,
               }}
               gap={10}
               p={3}
            >
               <Input
                  style={{ flex: `1` }}
                  onChange={handleChange}
                  placeholder={t(`Search`)}
                  size="md"
                  styles={{ input: { backgroundColor: `transparent`, border: `transparent`, color: `black` } }}
               />
               <Button size="md" color={theme.colors.shopee[5]}>
                  <IconSearch stroke={1} />
               </Button>
            </Group>
         </Popover.Target>
         <Popover.Dropdown>
            <Stack gap={2} mih={200} mah={300} style={{ overflowY: `auto`, position: `relative` }}>
               <LoadingOverlay visible={getProductList.isPending} zIndex={1000} overlayProps={{ radius: "sm", bg: `transparent` }} />
               <NodataOverlay visiable={getProductList.data?.items.length === 0 || getProductList.isError} />
               {getProductList.data?.items.map((product, i) => {
                  return (
                     <Group
                        onClick={() => {
                           router.push(`${ROUTER.PRODUCT}/${product._id}`);
                        }}
                        key={i}
                        className={`${classes[`box-1`]}`}
                        wrap="nowrap"
                        align="center"
                     >
                        <ProductImage width="30px" height="30px" src={product.imagePublicId} />
                        <Text truncate="end">{product.name}</Text>
                        <Text style={{ color: theme.colors.shopee[5], fontWeight: 900 }}>₫{renderData(product.price)}</Text>
                     </Group>
                  );
               })}
            </Stack>
         </Popover.Dropdown>
      </Popover>
   );
}
