export class PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}
