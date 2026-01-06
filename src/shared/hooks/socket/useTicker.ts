/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { socketService } from "../services/socket";

export function useSocketTicker(symbol: string) {
    const [ticker, setTicker] = useState<any>(null);
    const { isPublicConnected } = useSocketContext();
    useEffect(() => {
      if (!symbol || !isPublicConnected) return;
  
      const topic = `ticker:${symbol}`;
  
      socketService.subscribe([topic]);
  
      const removeListener = socketService.onTicker((data) => {
        setTicker(data);
      });
      return () => {
        socketService.unsubscribe([topic]);
        removeListener();
      };
    }, [symbol, isPublicConnected]);
  
    return ticker;
  }