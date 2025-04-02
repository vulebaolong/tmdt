"use client";

import TableCustom from "@/components/table-custom/TableCustom";
import TextBack from "@/components/text-back/TextBack";
import { formatLocalTime, renderData } from "@/helpers/function.helper";
import { IOrder } from "@/schemas/order.schema";
import { ITransaction } from "@/schemas/transaction.schema";
import { useTransactions } from "@/tantask/transaction.tanstack";
import { EOrderPaymentMethod } from "@/types/enum/order.enum";
import { Container, Stack, Text, useMantineTheme } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import classes from "./Transaction.module.css";

export interface ITransactionPopulated extends Omit<ITransaction, "orderId"> {
   orderId?: IOrder;
}

export default function Transaction() {
   const router = useRouter();
   const theme = useMantineTheme();

   const columnHelper = createColumnHelper<ITransactionPopulated>();
   const columns = useMemo(
      () => [
         columnHelper.accessor("_id", {
            header: "ID",
            size: 100,
            cell: ({ cell }) => (
               <Text truncate="end" maw={100} className={`${classes[`text`]}`} size="sm" ta={`start`}>
                  {cell.getValue() as string}
               </Text>
            ),
         }),
         columnHelper.accessor("transferAmount", {
            header: "Số tiền",
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" fw={500} maw={150} className={`${classes[`text`]}`} size="sm" c={theme.colors.shopee[5]}>
                  ₫{renderData(cell.getValue())}
               </Text>
            ),
         }),
         columnHelper.accessor("orderId", {
            header: "đơn hàng",
            size: 150,
            cell: ({ cell }) => {
               const orderId = cell.getValue()?._id?.toString();
               return (
                  <Text
                     onClick={() => {
                        console.log(orderId);
                        if (orderId) router.push(`/order/${orderId}`);
                     }}
                     truncate="end"
                     maw={150}
                     className={`${classes[`text`]}`}
                     style={{ cursor: `pointer`, textDecoration: `underline` }}
                     size="sm"
                  >
                     {orderId}
                  </Text>
               );
            },
         }),
         columnHelper.accessor((row) => row.orderId?.paymentMethod, {
            id: "paymentMethod",
            header: "Phương thức",
            size: 150,
            cell: ({ cell }) => {
               const paymentMethod = cell.getValue();
               if (paymentMethod === undefined || paymentMethod === null) return `--`;
               return (
                  <Text truncate="end" maw={150} className={`${classes[`text`]}`} style={{ cursor: `pointer` }} size="sm">
                     {EOrderPaymentMethod[paymentMethod]}
                  </Text>
               );
            },
         }),
         columnHelper.accessor("createdAt", {
            header: "CreatedAt",
            size: 150,
            cell: ({ cell }) => (
               <Text truncate="end" maw={150} className={`${classes[`text`]}`} size="sm">
                  {formatLocalTime(cell.getValue())}
               </Text>
            ),
         }),
      ],
      []
   );

   return (
      <>
         <Container pt={50} pb={100}>
            <Stack>
               <TextBack />

               <TableCustom<ITransaction>
                  styleTableTh={{ textAlign: `center` }}
                  styleTableTd={{ textAlign: `center` }}
                  heightScroll={400}
                  columns={columns}
                  fetchData={useTransactions}
               />
            </Stack>
         </Container>
      </>
   );
}
