import { ACCESS_TOKEN } from "@/shared/utils/constants";
import { create } from "zustand";

interface UserState {
  user: { email: string } | null;
  setUser: (user: { email: string } | null, loading?: boolean) => void;
  clearUser: () => void;
  isExpiredToken: boolean;
  loading: boolean;
  setExpiredToken: (isExpired: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  isExpiredToken: false,
  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null }),
  setExpiredToken: (isExpired) => set({ isExpiredToken: isExpired }),
}));

export const useIsLoggedIn = () => {
  const user = useUserStore((state) => state.user);

  const token = localStorage.getItem(ACCESS_TOKEN);

  return !!token && user !== null;
};

// dùng riêng cho overview, load trang về home
export const useIsLoggedToken = () => {
  return !!localStorage.getItem(ACCESS_TOKEN);
};
