import { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { socketService } from "@/shared/services/socket";

export function useSocketOrderBook<T>(symbol: string) {
  const [orderBook, setOrderBook] = useState<T | null>(null);
  const { isPublicConnected } = useSocketContext();
  useEffect(() => {
    if (!symbol || !isPublicConnected) return;
    const topic = `orderbook:${symbol}`;

    socketService.subscribe([topic]);

    const removeListener = socketService.onOrderBook((data) => {
      setOrderBook(data);
    });

    return () => {
      socketService.unsubscribe([topic]);
      setOrderBook(null);
      removeListener();
    };
  }, [symbol, isPublicConnected]);

  return orderBook;
}
