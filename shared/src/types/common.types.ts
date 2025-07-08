export interface Pagination {
  page: number;
  limit: number;
  total?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}