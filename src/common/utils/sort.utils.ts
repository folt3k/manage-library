import { SortOrder, SortParams } from "../types/sort";

export const prepareOrderBy = (
  params: SortParams,
  mapperFn: (params: Required<SortParams>) => object | undefined,
  defaultOrderBy: object = {}
): object => {
  if (params.sortBy) {
    const sortOrder: SortOrder = params.sortOrder || "asc";

    const orderBy = mapperFn({ sortBy: params.sortBy, sortOrder });

    if (orderBy) {
      return orderBy;
    }
  }

  return defaultOrderBy;
};
