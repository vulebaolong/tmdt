import { TResPagination } from "@/types/app.type";
import {
   ActionIcon,
   Box,
   Group,
   LoadingOverlay,
   MantineStyleProp,
   Pagination,
   Paper,
   ScrollArea,
   Select,
   Table,
   TableTbody,
   TableTd,
   TableTh,
   TableThead,
   TableTr,
} from "@mantine/core";
import { IconEdit, IconTrashFilled } from "@tabler/icons-react";
import { UseQueryResult } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import NodataOverlay from "../no-data/NodataOverlay";
import classes from "./TableCustom.module.css";

export type TPaginationTable = {
   pageIndex: number;
   pageSize: number;
};

export type TPayload = {
   pagination: TPaginationTable;
   filters: any;
   refetchInterval?: number | false;
};

type TProps<T> = {
   fetchData: (payload: TPayload) => UseQueryResult<TResPagination<T>>;
   columns: any;
   filters?: any;
   heightScroll?: string | number;
   showPaginations?: boolean;
   showPageSize?: boolean;
   refetchInterval?: number | false;
   styleTable?: MantineStyleProp;
   styleTableThead?: MantineStyleProp;
   styleTableTbody?: MantineStyleProp;
   styleTableTh?: MantineStyleProp;
   styleTableTr?: MantineStyleProp;
   styleTableTd?: MantineStyleProp;
   onEdit?: (row: T) => void;
   onDelete?: (row: T) => void;
};

function TableCustom<T>(props: TProps<T>) {
   const {
      columns,
      fetchData,
      filters = {},
      heightScroll = `500px`,
      showPaginations = true,
      showPageSize = true,
      refetchInterval = false,
      styleTable = {},
      styleTableThead = {},
      styleTableTbody = {},
      styleTableTh = {},
      styleTableTr = {},
      styleTableTd = {},
      onEdit,
      onDelete,
   } = props;

   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

   const queryData = fetchData({ pagination: { pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize }, filters, refetchInterval });

   const [totalPage, setTotalPage] = useState(1);
   useEffect(() => {
      if (typeof queryData.data?.pageCount === "number" && queryData.data?.pageCount >= 0) {
         setTotalPage(queryData.data?.pageCount);
      }
   }, [queryData.data?.pageCount]);

   const table = useReactTable({
      columns,
      data: queryData.data?.items || [],
      pageCount: queryData.data?.pageCount,
      manualPagination: true,
      onPaginationChange: setPagination,
      state: { pagination },
      getCoreRowModel: getCoreRowModel(),
   });

   const renderContent = () => {
      if (queryData.isLoading) return <></>;

      if (!queryData.data || queryData.data.items.length === 0 || queryData.isError) return <></>;

      return (
         <>
            {table.getRowModel().rows.map((row, rowIndex) => (
               <TableTr
                  key={rowIndex}
                  style={{
                     opacity: "0",
                     animation: "fadeInUp 0.5s forwards",
                     animationDelay: `${50 * rowIndex}ms`,
                     ...styleTableTr,
                  }}
               >
                  {row.getVisibleCells().map((cell, colIndex) => {
                     return (
                        <TableTd style={{ ...styleTableTd }} key={colIndex}>
                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableTd>
                     );
                  })}
                  {(onEdit || onDelete) && (
                     <TableTd style={{ ...styleTableTd }}>
                        <Group wrap="nowrap">
                           {onEdit && (
                              <ActionIcon onClick={() => onEdit?.(row.original)} variant="light" aria-label="Settings">
                                 <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
                              </ActionIcon>
                           )}
                           {onDelete && (
                              <ActionIcon onClick={() => onDelete?.(row.original)} variant="light" aria-label="Settings">
                                 <IconTrashFilled style={{ width: "70%", height: "70%" }} stroke={1.5} />
                              </ActionIcon>
                           )}
                        </Group>
                     </TableTd>
                  )}
               </TableTr>
            ))}
         </>
      );
   };

   return (
      <Box className={`${classes[`table`]}`}>
         <Paper pos="relative" shadow="md" radius="lg" withBorder p="xl">
            <LoadingOverlay visible={queryData.isLoading} zIndex={1000} overlayProps={{ radius: "sm", bg: `transparent` }} />
            <NodataOverlay visiable={!queryData.isLoading && (!queryData.data || queryData.data.items.length === 0 || queryData.isError)} />

            <ScrollArea
               type="always"
               offsetScrollbars
               styles={{ thumb: { backgroundColor: `var(--mantine-color-blue-7)` }, root: { height: heightScroll } }}
            >
               <Table stickyHeader style={{ ...styleTable }} withColumnBorders striped>
                  <TableThead style={{ ...styleTableThead }}>
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableTr key={headerGroup.id} style={{ ...styleTableTr }}>
                           {headerGroup.headers.map((header) => {
                              return (
                                 <TableTh key={header.id} style={{ ...styleTableTh }}>
                                    <Box w={header.getSize()}>
                                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </Box>
                                 </TableTh>
                              );
                           })}
                           {/* <TableTh style={{ ...styleTableTh }}>Action</TableTh> */}
                        </TableTr>
                     ))}
                  </TableThead>

                  <TableTbody style={{ ...styleTableTbody }}>{renderContent()}</TableTbody>
               </Table>
            </ScrollArea>
         </Paper>

         {(showPaginations || showPageSize) && (
            <Box className={`${classes[`box-pagination`]}`}>
               {showPaginations && (
                  <Pagination
                     size={"xs"}
                     total={totalPage}
                     value={pagination.pageIndex + 1}
                     onChange={(e) => {
                        table.setPageIndex(Number(e) - 1);
                     }}
                  />
               )}
               {showPageSize && (
                  <Select
                     size={`xs`}
                     styles={{ input: { height: `22px`, minHeight: `22px` } }}
                     w={60}
                     value={pagination.pageSize.toString()}
                     onChange={(e) => {
                        table.setPageSize(Number(e));
                     }}
                     allowDeselect={false}
                     data={["10", "20", "30", "40", "50"]}
                  />
               )}
            </Box>
         )}
      </Box>
   );
}

export default TableCustom;
