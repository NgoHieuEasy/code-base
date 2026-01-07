import { ACCESS_TOKEN } from "@/shared/utils/constants";

export const useAuth = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return { token };
};