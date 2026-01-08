import { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { socketService } from "@/shared/services/socket";

export function useFundingRate(symbol: string, enabled: boolean) {
  const [fundingRate, setFundingRate] = useState<any>(null);
  const { isPublicConnected } = useSocketContext();
  useEffect(() => {
    if (!symbol || !isPublicConnected || !enabled) return;

    const topic = `funding_rate:${symbol}`;

    socketService.subscribe([topic]);

    const removeListener = socketService.onFundingRate((data: any) => {
      setFundingRate(data);
    });
    return () => {
      socketService.unsubscribe([topic]);
      removeListener();
    };
  }, [symbol, isPublicConnected, enabled]);

  return fundingRate;
}
