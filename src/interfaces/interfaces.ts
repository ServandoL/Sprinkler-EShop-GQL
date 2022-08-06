import { Document } from 'mongodb';

export interface Pagination {
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  sort?: string[];
}

export interface PaginatedResponse {
  data: Document[];
  pagination: Pagination;
}
