// editOrder: EditOrderType;
// setEditOrder: Dispatch<SetStateAction<EditOrderType>>;
import { create } from "zustand";

interface IChartStore {
  editOrderData: EditOrderType;
  setEditOrderData: (
    value: Partial<EditOrderType> | ((prev: EditOrderType) => EditOrderType)
  ) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  isChartReady: boolean;
  setIsChartReady: () => void;
  isChartLoading: boolean;
  chartLoaded: () => void;
  triggerChartLoading: () => void;
}

interface OrderData {
  price: number;
  qty: number;
  symbol: string;
  type: string;
}

interface EditOrderType {
  open: boolean;
  callback: () => void;
  order: OrderData;
  onCancel: () => void;
}
export const useChartStore = create<IChartStore>((set) => ({
  editOrderData: {
    open: false,
    callback: () => {},
    order: {
      price: 0,
      qty: 0,
      symbol: "",
      type: "",
    },
    onCancel: () => {},
  },
  timeframe: "60",
  isChartReady: false,
  isChartLoading: false,
  chartLoaded: () => set(() => ({ isChartLoading: false })),
  triggerChartLoading: () => set(() => ({ isChartLoading: true })),

  setIsChartReady: () => set({ isChartReady: true }),
  setTimeframe: (value) => set({ timeframe: value }),
  setEditOrderData: (value) =>
    set((state) => ({
      editOrderData:
        typeof value === "function"
          ? value(state.editOrderData)
          : { ...state.editOrderData, ...value },
    })),
}));
