export interface Pagination {
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number;
  nextPage: number;
  pagingCounter: number;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  sort?: string[];
}
