import apiClient from "@/axios/api-client";
import { getAxios } from "@/axios/axios";
import type {
  IFiltersRequestParams,
  IPaginationMeta,
} from "@/shared/types/axios";
import type {
  IExchangeInfo,
  IMiniOrderBook,
  IOrder,
  IPosition,
  ITradeHistory,
} from "@/shared/types/exchange";
import { formatTimeframe } from "@/shared/utils/utilts";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Position } from "public/static/charting_library/charting_library";

export function usePositions(status?: string) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    IPosition[],
    AxiosError
  >({
    queryKey: ["portfolio-positions", status],
    queryFn: () =>
      getAxios({
        url: "/positions",
      }),
  });

  return {
    positions: data,
    isLoading,
    isFetching,
    error,
    refetch,
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
  };
}

export function useOpenOrders(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    { rows: IOrder[]; meta: any },
    AxiosError
  >({
    queryKey: ["open-orders", filterParams],
    queryFn: () =>
      getAxios({
        url: "/orders",
        filterParams,
      }),
    // Poll every 5 seconds for open orders if needed, or rely on websocket updates separately
    // refetchInterval: 5000,
  });

  return {
    orders: data?.rows,
    isLoading,
    isFetching,
    error,
    refetch,
    isEmpty: Array.isArray(data?.rows) ? data?.rows.length === 0 : !data,
  };
}

export function useTicker(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["get-ticker", filterParams],
    queryFn: () =>
      getAxios({
        url: `market/ticker/${filterParams?.symbol}`,
        filterParams,
      }),
    staleTime: 0,
  });

  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return {
    ticker: data,
    tickerLoading: isLoading,
    tickerFetching: isFetching,
    tickerError: error,
    tickerEmpty: isEmpty,
  };
}

export function useExchangeInfo(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery<
    IExchangeInfo[],
    AxiosError
  >({
    queryKey: ["get-exchange-info", filterParams],
    queryFn: () =>
      getAxios({
        url: `/market/exchange-info`,
        filterParams,
      }),
    // enabled: !!filterParams?.symbol,
    staleTime: 0,
  });

  const matchedSymbolInfo = filterParams?.symbol
    ? data?.find(
        (item) =>
          item.symbol === filterParams.symbol &&
          item.type === filterParams.marketType
      )
    : data;
  const isEmpty = filterParams?.symbol
    ? !matchedSymbolInfo
    : Array.isArray(data)
    ? data.length === 0
    : !data;

  return {
    exInfo: matchedSymbolInfo,
    exInfoLoading: isLoading,
    exInfoFetching: isFetching,
    exInfoError: error,
    exInfoEmpty: isEmpty,
  };
}

export function useOrderBook(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery<
    IMiniOrderBook,
    AxiosError
  >({
    queryKey: ["get-order-books", filterParams],
    queryFn: () =>
      getAxios({
        url: `market/orderbook/${filterParams?.symbol}`,
        filterParams,
      }),
    // enabled: !!filterParams?.symbol,
    // gcTime: 1000 * 60 * 60 * 2,
    // staleTime: 1000 * 60 * 5,
  });
  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return {
    orBooks: data || null,
    obLoading: isLoading,
    obFetching: isFetching,
    obError: error,
    obEmpty: isEmpty,
  };
}

export function useAggTrades(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery<ITrade[], AxiosError>(
    {
      queryKey: ["get-order-books", filterParams],
      queryFn: () =>
        getAxios({
          url: `market/trades/${filterParams?.symbol}`,
          filterParams,
        }),
    }
  );
  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return {
    aggTrades: data,
    aggTradesLoading: isLoading,
    aggTradesFetching: isFetching,
    aggTradesError: error,
    aggTradesEmpty: isEmpty,
  };
}

export function usePositionHistory(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    IPaginationMeta<Position>,
    AxiosError
  >({
    queryKey: ["portfolio-position-history"],
    queryFn: () =>
      getAxios({
        url: "/positions/history",
        filterParams,
      }),
  });

  return {
    positions: data?.rows,
    meta: data?.meta,
    isLoading,
    isFetching,
    error,
    refetch,
    isEmpty: Array.isArray(data?.rows) ? data?.rows.length === 0 : !data,
  };
}

export function useTrades(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery<
    IPaginationMeta<ITradeHistory>,
    AxiosError
  >({
    queryKey: ["trades", filterParams],
    queryFn: () =>
      getAxios({
        url: "/trades",
        filterParams,
      }),
  });

  return {
    trades: data,
    isLoading,
    isFetching,
    error,
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
  };
}

export function useTransactions(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery<any[], AxiosError>({
    queryKey: ["portfolio-transactions", filterParams],
    queryFn: () =>
      getAxios({
        url: "user/portfolio/transactions",
        filterParams,
      }),
  });

  return {
    transactions: data,
    isLoading,
    isFetching,
    error,
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
  };
}


export function useTickers(filterParams?: IFiltersRequestParams) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["get-tickers", filterParams],
    queryFn: () =>
      getAxios({
        url: "market/tickers",
        filterParams,
      }),
    staleTime: 0,
  });

  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return {
    tickers: data,
    tickersLoading: isLoading,
    tickersFetching: isFetching,
    tickersError: error,
    tickersEmpty: isEmpty,
  };
}

// ======================== MUTE ======================

export const closePosition = async (data: {
  positionId: number;
  quantity?: string | null;
}) => {
  const response = await apiClient.post("positions/close", data);
  return response;
};
export const setPositionTpSl = async (data: {
  positionId: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
}) => {
  const response = await apiClient.post("positions/set_tpsl", data);
  return response;
};
export const cancelOrder = async ({ orderId }: { orderId: string }) => {
  const response = await apiClient.delete(`/orders/${orderId}`);
  return response;
};
export const fetchMarketHistory = async (params: {
  symbol: string;
  timeframe: string;
  from: number;
  to: number;
}) => {
  const interval = formatTimeframe(params.timeframe);
  const response = await apiClient.get(
    `/market/kline?symbol=${params.symbol}&interval=${interval}&startTime=${params.from}&endTime=${params.to}`
  );
  return response.data;
};
