import type { AxiosInstance } from "axios";
import apiClient from "./api-client";
import type { IFiltersRequestParams } from "@/shared/types/axios";

interface Props {
  url: string;
  filterParams?: IFiltersRequestParams | null;
  client?: AxiosInstance;
}
export const getAxios = async ({
  url,
  filterParams,
  client = apiClient,
}: Props) => {
  const params = new URLSearchParams();

  if (filterParams) {
    const {
      page,
      limit,
      type,
      sortBy,
      currency,
      status,
      transaction,
      packageId,
      startTime,
      endTime,
      search,
      category,
      asset,
      walletType,
      interval,
      marketType,
      chainId,
      keyWord,
      userId,
      userIdCex,
      isActive,
      isVerified,
      order,
      orderBy,
      mode,
      days,
      side,
      traderId,
      duration,
      sort,
      level,
      packageN,
      active,
      signalGroupId,
    } = filterParams;

    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (type) params.append("type", type);
    if (sortBy) params.append("sortBy", sortBy);
    if (currency) params.append("currency", currency);
    if (status) params.append("status", status);
    if (transaction) params.append("transaction", transaction);
    if (packageId) params.append("packageId", packageId);
    if (startTime) params.append("startTime", startTime);
    if (endTime) params.append("endTime", endTime);
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (asset) params.append("asset", asset);
    if (walletType) params.append("walletType", walletType);
    if (interval) params.append("interval", interval);
    if (marketType) params.append("marketType", marketType);
    if (chainId) params.append("chainId", chainId);
    if (keyWord) params.append("keyWord", keyWord);
    if (userId) params.append("userId", userId);
    if (userIdCex) params.append("userIdCex", userIdCex);
    if (isActive) params.append("isActive", isActive);
    if (isVerified) params.append("isVerified", isVerified);
    if (order) params.append("order", order);
    if (orderBy) params.append("orderBy", orderBy);
    if (days) params.append("days", days);
    if (mode) params.append("mode", mode);
    if (side) params.append("side", side);
    if (traderId) params.append("traderId", traderId);
    if (sort) params.append("sort", sort);
    if (level) params.append("level", level);
    if (packageN) params.append("packageN", packageN);
    if (duration) params.append("duration", duration);
    if (active) params.append("active", active);
    if (signalGroupId) params.append("signalGroupId", signalGroupId);
  }

  const baseUrl = filterParams ? `${url}?${params.toString()}` : url;

  const response = await client.get(baseUrl);
  return response.data;
};

export function catchAsync<T>(fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };
}
