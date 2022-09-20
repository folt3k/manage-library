export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface ListWithPagination<T> {
  page: number;
  perPage: number;
  total: number;
  items: (T | Partial<T>)[];
}
