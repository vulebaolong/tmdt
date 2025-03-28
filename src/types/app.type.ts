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
   itemCount: number;
   pageCount: number;
   filterable: string[];
   sortable: string[];
};
