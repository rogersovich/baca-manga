export interface TBaseResponse<T> {
  data: T;
  pagination: TBasePagination;
}

export interface TBasePagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: TBasePaginationItem;
}
export interface TBasePaginationItem {
  count: number;
  total: number;
  per_age: number;
}
