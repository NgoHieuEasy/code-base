/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { socketService } from "../services/socket";

export function useSocketAllSpotTickers({ enabled }: { enabled: boolean }) {
  const [tickers, setTickers] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const topic = "ticker:spot:all";
    socketService.subscribe([topic]);
    const removeListener = socketService.onAllSpotTickers((data: any[]) => {
      setTickers(data);
    });

    return () => {
      socketService.unsubscribe([topic]);
      removeListener();
    };
  }, [enabled]);

  return tickers;
}

export function useSocketAllFutureTickers({ enabled }: { enabled: boolean }) {
  const [tickers, setTickers] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const topic = "ticker:futures:all";
    socketService.subscribe([topic]);
    const removeListener = socketService.onAllFutureTickers((data: any[]) => {
      setTickers(data);
    });

    return () => {
      socketService.unsubscribe([topic]);
      removeListener();
    };
  }, [enabled]);

  return tickers;
}
