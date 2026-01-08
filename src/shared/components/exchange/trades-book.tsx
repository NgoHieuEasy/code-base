import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SkeletonOrderBook } from "./order-book";
import { useSocketTrades } from "@/shared/hooks/socket/useTrade";
import { fNumber } from "@/shared/utils/format-number";
import { fTime } from "@/shared/utils/format-time";
import type { ITrade } from "@/shared/types/exchange";
import { useAggTrades } from "@/shared/hooks/remote/useExchange";

const TradesBook = () => {
  const { id } = useParams<{ id: string }>();
  const filters = {
    page: String(1),
    limit: String(20),
    symbol: id,
    type: "SPOT",
  };
  const socketTrades = useSocketTrades(id as string);
  const { aggTrades, aggTradesLoading } = useAggTrades(filters);

  // useEffect(() => {
  //   if (aggTrades && aggTrades.length > 0) {
  //     setTrades(aggTrades);
  //   }
  // }, [aggTrades]);

  // useEffect(() => {
  //   if (socketTrades?.length) {
  //     setTrades((prev) => [...socketTrades, ...prev].slice(0, 200));
  //   }
  // }, [socketTrades]);

  const trades: ITrade[] = useMemo(() => {
    if (!aggTrades && !socketTrades) return [];

    const baseTrades = aggTrades ?? [];

    if (!socketTrades?.length) {
      return baseTrades.slice(0, 200);
    }

    return [...socketTrades, ...baseTrades].slice(0, 200);
  }, [aggTrades, socketTrades]);

  return (
    <div className="w-full h-full overflow-y-auto px-3 py-2 text-white bg-card-primary">
      <div
        className="
    grid 
    grid-cols-3 
    pb-2 
    mb-2 
    text-[12px] 
    font-medium 
    opacity-70 
    text-gray-500
  "
      >
        <span>Price (USDT)</span>
        <span className="text-right">Size (USDT)</span>
        <span className="text-right">Time</span>
      </div>

      <div className="overflow-y-auto max-h-[350px] md:max-h-[495px] pr-2">
        {aggTradesLoading ? (
          <SkeletonOrderBook />
        ) : (
          <div>
            {trades &&
              trades.map((trade, i) => (
                <div
                  key={trade.i}
                  className={`${trade.m ? "text-red-500" : "text-green-500"} ${
                    i === 0 ? "animate-slide-up" : ""
                  }`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "4px 0",
                    fontSize: 13,
                  }}
                >
                  <span>{fNumber(trade.p)}</span>

                  <span className="text-right">{trade.q}</span>

                  <span className="text-right">{fTime(trade.t)}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesBook;
