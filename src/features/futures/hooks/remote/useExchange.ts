import { getAxios } from "@/axios/axios";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { IFuturesAccount } from "../../types";

export function useFuturesBalance() {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    IFuturesAccount,
    AxiosError
  >({
    queryKey: ["portfolio-futures-balance"],
    queryFn: () =>
      getAxios({
        url: "/wallet/future/balances",
      }),
  });

  return {
    balance: data,
    isLoading,
    isFetching,
    error,
    refetch,
    isEmpty: !data,
  };
}
