export type TRes<T> = {
   status: string;
   statusCode: number;
   message: string;
   data: T;
};

export type TResPagination<T> = {
   page: number;
   pageSize: number;
   items: T[];
   totalItem: number;
   totalPage: number;
   filterable: string[];
   sortable: string[];
};
