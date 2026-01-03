// ---------------------------REQUEST---------------------------------

export const netWorkConfig = {
  refetchOnWindowFocus: false,
};
export interface IFiltersRequestParams {
  id?: string;
  page?: string | number;
  limit?: string | number;
  status?: string;
  sortBy?: string;
  type?: string;
  duration?: string;
  currency?: string;
  transaction?: string;
  packageId?: string;
  symbol?: string;
  startTime?: string;
  endTime?: string;
  search?: string;
  asset?: string;
  walletType?: string;
  category?: string;
  interval?: string;
  chainId?: string;
  marketType?: string;
  keyWord?: string;
  userId?: string;
  userIdCex?: string;
  orderBy?: string;
  order?: string;
  isActive?: string;
  isVerified?: string;
  days?: string;
  mode?: string;
  side?: string;
  traderId?: string;
  sort?: string;
  level?: string;
  packageN?: string;
  signalId?: string;
  active?: string;
  signalGroupId?: string;
}
export interface IParamsRequest {
  limit: number;
  page: number;
}
export interface AxiosErrorResponse {
  message?: string;
  status?: number;
  statusText?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
}
export interface IPaginationMeta<T> {
  rows: T[];
  meta: IMeta;
}

interface IMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalPages?: number;
}

export interface IPaginationMetaBot<T> {
  rows: T[];
  meta: IMeta;
}
