/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { socketService } from "../services/socket";

export function useSocketTrades(symbol: string, maxTrades: number = 50) {
    const [trades, setTrades] = useState<any[]>([]);
    
    const { isPublicConnected } = useSocketContext(); 
  
    useEffect(() => {
      if (!symbol || !isPublicConnected) return;
  
      const topic = `trades:${symbol}`;
  
      socketService.subscribe([topic]);
  
      const removeListener = socketService.onTrade((trade) => {
        setTrades((prev) => {
          const newTrades = [trade, ...prev];
          if (newTrades.length > maxTrades) {
            return newTrades.slice(0, maxTrades);
          }
          return newTrades;
        });
      });
  
      return () => {
        socketService.unsubscribe([topic]);
        setTrades([]); 
        removeListener();
      };
    }, [symbol, maxTrades, isPublicConnected]); 
  
    return trades;
  }
  