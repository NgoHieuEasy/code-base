import { getAxios } from "@/axios/axios";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ICreateOrder, IWallet } from "../../types";
import apiClient from "@/axios/api-client";

export function useSpotBalances(walletType?: string) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<
    IWallet[],
    AxiosError
  >({
    queryKey: ["portfolio-balances", walletType],
    queryFn: () =>
      getAxios({
        url: "/wallet/spot/balances",
        filterParams: { walletType } as any,
      }),
  });

  return {
    balances: data,
    isLoading,
    isFetching,
    error,
    refetch,
    isEmpty: Array.isArray(data) ? data.length === 0 : !data,
  };
}
export const createOrder = async (data: ICreateOrder) => {
  const response = await apiClient.post("order", data);
  return response;
};
