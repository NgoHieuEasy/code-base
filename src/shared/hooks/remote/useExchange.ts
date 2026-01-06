import apiClient from "@/axios/api-client";
import { getAxios } from "@/axios/axios";
import type { IFiltersRequestParams } from "@/shared/types/axios";
import type { IExchangeInfo, IOrder, IPosition } from "@/shared/types/exchange";
import { formatTimeframe } from "@/shared/utils/utilts";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

// ================== POSITIONS ==================
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

// ================== QUERIES ==================

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
