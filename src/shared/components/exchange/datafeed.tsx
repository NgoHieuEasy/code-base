/* eslint-disable */

import { fetchMarketHistory } from "@/shared/hooks/remote/useExchange";
import type { ISocketService } from "@/shared/hooks/services/ISocketService";
import { formatSymbol, formatTimeframe } from "@/shared/utils/utilts";

const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "1D",
  "3D",
  "1W",
  "1M",
];

const lastBarsCache = new Map();

const subscriptions = new Map<
  string,
  {
    symbol: string;
    topic: string;
    handler: (kline: any) => void;
  }
>();

export const Datafeed = (
  asset: any,
  socket: ISocketService,
  decimals: number
) => {
  return {
    onReady: (
      callback: (data: { supported_resolutions: string[] }) => void
    ) => {
      callback({ supported_resolutions: supportedResolutions });
    },
    resolveSymbol: (
      symbolName: string,
      onResolve: (symbolInfo: any) => void
    ) => {
      const price = asset?.mark_price || 1;
      const params = {
        name: formatSymbol(asset?.symbol),
        description: "",
        type: "crypto",
        session: "24x7",
        ticker: asset?.symbol,
        minmov: 1,
        pricescale: Math.pow(10, decimals),
        // pricescale: Math.min(
        //   10 ** String(Math.round(10000 / price)).length,
        //   10000000000000000
        // ),
        has_intraday: true,
        intraday_multipliers: ["1", "5", "15", "30", "60"],
        supported_resolution: supportedResolutions,
        volume_precision: 2,
        data_status: "streaming",
      };
      onResolve(params);
    },
    getBars: async (
      symbolInfo: any,
      resolution: string,
      periodParams: { from: number; to: number; firstDataRequest: boolean },
      onResult: Function
    ) => {
      const { from, to, firstDataRequest } = periodParams;

      const params = {
        symbol: symbolInfo.ticker,
        timeframe: resolution,
        from: from * 1000,
        to: to * 1000,
      };

      const data = await fetchMarketHistory(params);

      if (data && data.length > 0) {
        const bars = data.map((k: any) => {
          return {
            time: Number(k.t),
            open: Number(k.o),
            high: Number(k.h),
            low: Number(k.l),
            close: Number(k.c),
            volume: Number(k.v),
          };
        });

        onResult(bars, { noData: false });
        lastBarsCache.set(symbolInfo.ticker, { ...bars[bars.length - 1] });
        if (firstDataRequest) {
          lastBarsCache.set(symbolInfo.ticker, {
            ...bars[bars.length - 1],
          });
        }
      } else {
        onResult([], { noData: true });
      }
    },
    searchSymbols: () => {},
    subscribeBars: (
      symbolInfo: any,
      resolution: string,
      onRealtimeCallback: Function,
      subscriberUID: string
    ) => {
      if (!socket) return;

      const symbol = symbolInfo.ticker;

      // map resolution if needed
      const timeframe = formatTimeframe(resolution); // e.g. 1m, 5m
      const topic = `kline:${symbol}:${timeframe}`;

      const handler = (kline: any) => {
        onRealtimeCallback({
          time: Number(kline.t),
          open: Number(kline.o),
          high: Number(kline.h),
          low: Number(kline.l),
          close: Number(kline.c),
          volume: Number(kline.v),
        });
      };

      socket.subscribe([topic]);
      socket.onKline(handler);

      subscriptions.set(subscriberUID, {
        symbol,
        topic,
        handler,
      });
    },
    unsubscribeBars: (subscriberUID: string) => {
      if (!socket) return;

      const sub = subscriptions.get(subscriberUID);
      if (!sub) return;

      socket.unsubscribe([sub.topic]);

      subscriptions.delete(subscriberUID);
    },
    getMarks: () => ({}),
    getTimeScaleMarks: () => ({}),
    getServerTime: () => ({}),
  };
};
