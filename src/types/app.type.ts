export type TRes<T> = {
   status: string;
   statusCode: number;
   message: string;
   data: T;
};

export type TResPagination<T> = {
   page: number;
   pageSize: number;
   totalPages: number;
   totalItems: number;
   items: T;
};
