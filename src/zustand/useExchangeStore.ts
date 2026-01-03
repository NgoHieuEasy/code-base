import type { IExchangeInfo } from "@/shared/types/exchange";
import { create } from "zustand";
interface ExchangeState {
  exInfo: IExchangeInfo | null;
  currentPrice: number;
  setExInfo: (exInfo: IExchangeInfo) => void;
  setCurrentPrice: (currentPrice: number) => void;
}
export const useExchangeStore = create<ExchangeState>((set) => ({
  exInfo: null,
  currentPrice: 0,
  setExInfo: (exInfo) => set({ exInfo }),
  setCurrentPrice: (currentPrice) => set({ currentPrice }),
}));
