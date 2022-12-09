import { DEFAULT_PER_PAGE } from "../constans";
import { PaginationParams } from "../types/pagination";

export const getPaginationParamsFromQuery = (query: {
  [key: string]: string | undefined | unknown;
}): PaginationParams => ({
  page: query.page ? +query.page : 1,
  perPage: query.perPage ? +query.perPage : DEFAULT_PER_PAGE,
});
