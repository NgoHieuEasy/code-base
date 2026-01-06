
import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { socketService } from "../services/socket";

export function useIndexPrice(symbol: string, enabled: boolean) {
  const [indexPrice, setIndexPrice] = useState<any>(null);
  const { isPublicConnected } = useSocketContext();
  useEffect(() => {
    if (!symbol || !isPublicConnected || !enabled) return;

    const topic = `index_price:${symbol}`;

    socketService.subscribe([topic]);

    const removeListener = socketService.onIndexPrice((data: any) => {
      setIndexPrice(data.p);
    });
    return () => {
      socketService.unsubscribe([topic]);
      removeListener();
    };
  }, [symbol, isPublicConnected, enabled]);

  return indexPrice;
}
