import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  toastData: { type: ToastType; message: string } | null;
  showToast: (type: ToastType, message: string) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toastData: null,
  // toastData: {
  //   type: "info",
  //   message: "Debug toast đang hiện luôn ",
  // },
  showToast: (type, message) => {
    set({ toastData: { type, message } });
    setTimeout(() => set({ toastData: null }), 3000);
  },
  clearToast: () => set({ toastData: null }),
}));
