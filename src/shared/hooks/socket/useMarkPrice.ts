import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { socketService } from "../services/socket";

export function useMarkPrice(symbol: string, enabled: boolean) {
  const [markPrice, setMarkPrice] = useState<any>(null);
  const { isPublicConnected } = useSocketContext();
  useEffect(() => {
    if (!symbol || !isPublicConnected || !enabled) return;

    const topic = `mark_price:${symbol}`;

    socketService.subscribe([topic]);

    const removeListener = socketService.onMarkPrice((data: any) => {
      setMarkPrice(data.p);
    });
    return () => {
      socketService.unsubscribe([topic]);
      removeListener();
    };
  }, [symbol, isPublicConnected, enabled]);

  return markPrice;
}
