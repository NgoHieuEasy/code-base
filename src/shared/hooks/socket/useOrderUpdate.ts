/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "../../context/SocketContext";
import { socketService } from "@/shared/services/socket";

export function useSocketOrderUpdate() {
  const queryClient = useQueryClient();
  const { isPrivateConnected } = useSocketContext();

  const [orderUpdate, setOrderUpdate] = useState<any>(null);

  useEffect(() => {
    if (!isPrivateConnected) {
      console.log("Not connected to private socket, skipping order update...");
      return;
    }

    const unsubOrderUpdate = socketService.onOrderUpdate((data) => {
      setOrderUpdate(data);
      queryClient.invalidateQueries({
        queryKey: [
          "open-orders",
          { limit: 50, status: "PENDING", symbol: "BTC_PERP" },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["portfolio-positions"] });
      queryClient.invalidateQueries({
        queryKey: ["portfolio-position-history", data.symbol],
      });
    });

    return () => {
      unsubOrderUpdate();
    };
  }, [isPrivateConnected]);

  return orderUpdate;
}
