import { create } from "zustand";

interface TradeState {
  currentPrice: number;
  setCurrentPrice: (currentPrice: number) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  currentPrice: 0,
  setCurrentPrice: (currentPrice) => set({ currentPrice }),
}));
