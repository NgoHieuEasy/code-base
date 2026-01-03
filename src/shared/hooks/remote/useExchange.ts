import { getAxios } from "@/axios/axios";
import type { IFiltersRequestParams } from "@/shared/types/axios";
import type { IExchangeInfo } from "@/shared/types/exchange";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

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