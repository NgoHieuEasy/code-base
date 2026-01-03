import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/utils/constants";
import { checkJwtExpiration } from "@/shared/utils/utilts";
import { useUserStore } from "@/zustand/useUserStore";

// let isRefreshing = false;
// let failedQueue: any[] = [];

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "",
  },
});
// Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const languge = localStorage.getItem("i18nextLng");
    if (token) {
      // Gắn token vào header
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Accept-Language"] = `${languge}`;

      const isExpired = checkJwtExpiration(token, 1);

      if (isExpired) {
        refreshToken();
        const setExpiredToken = useUserStore.getState().setExpiredToken;
        setExpiredToken(true);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Hàm refreshToken
export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) return null;

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

    return accessToken;
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};
export default apiClient;
