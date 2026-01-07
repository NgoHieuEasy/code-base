import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import FullIcon from "@/assets/icons/exchange/full-icon";
import BidsIcon from "@/assets/icons/exchange/bids-icon";
import AskIcon from "@/assets/icons/exchange/ask-icon";
import { useParams } from "react-router-dom";
import { useSocketTicker } from "@/shared/hooks/socket/useTicker";
import { useSocketOrderBook } from "@/shared/hooks/socket/useOrderbook";
import type { IMiniOrderBook, IOrderBookRow } from "@/shared/types/exchange";
import { useOrderBook } from "@/shared/hooks/remote/useExchange";
import Select from "../form/select";

export type RawOrder = [string, string];

export type OrderItem = {
  price: number;
  size: number;
  total: number;
  bar: number;
};

const processOrderBookData = (
  bids: [number, number][],
  asks: [number, number][],
  displayRows: number
) => {
  const bidsWithTotal: IOrderBookRow[] = [];
  const asksWithTotal: IOrderBookRow[] = [];

  let bidCumulative = 0;
  let askCumulative = 0;

  for (let i = 0; i < Math.min(bids.length, displayRows); i++) {
    const item = bids[i];
    const quantity = Number(item[1]);
    bidCumulative += quantity;

    bidsWithTotal.push({
      p: Number(item[0]),
      q: quantity,
      total: parseFloat(bidCumulative.toFixed(8)),
      percentage: 0,
    });
  }

  for (let i = 0; i < Math.min(asks.length, displayRows); i++) {
    const item = asks[i];
    const quantity = Number(item[1]);
    askCumulative += quantity;

    asksWithTotal.push({
      p: Number(item[0]),
      q: quantity,
      total: parseFloat(askCumulative.toFixed(8)),
      percentage: 0,
    });
  }

  const maxBidTotal =
    bidsWithTotal.length > 0
      ? bidsWithTotal[bidsWithTotal.length - 1]?.total || 1
      : 1;
  const maxAskTotal =
    asksWithTotal.length > 0
      ? asksWithTotal[asksWithTotal.length - 1]?.total || 1
      : 1;

  bidsWithTotal.forEach((row) => {
    row.percentage = row.total / maxBidTotal;
  });

  asksWithTotal.forEach((row) => {
    row.percentage = row.total / maxAskTotal;
  });

  return {
    bidsWithTotal: bidsWithTotal.sort((a, b) => b.p - a.p),
    asksWithTotal: asksWithTotal.sort((a, b) => b.p - a.p),
    maxBidTotal,
    maxAskTotal,
    maxBidPercentage:
      bidsWithTotal.length > 0
        ? bidsWithTotal[bidsWithTotal.length - 1]?.percentage || 0
        : 0,
    maxAskPercentage:
      asksWithTotal.length > 0
        ? asksWithTotal[asksWithTotal.length - 1]?.percentage || 0
        : 0,
  };
};

type Mode = "full" | "bids" | "asks";

export const OrderBook = () => {
  const { id } = useParams();
  const prevPriceRef = useRef<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(
    null
  );
  const [filters, setFilters] = useState({
    page: String(1),
    limit: String(30),
    symbol: id,
    type: "SPOT",
  });

  const ticker = useSocketTicker(id as string);

  const socketOB = useSocketOrderBook<IMiniOrderBook>(id as string);
  // const [orderBooks, setOrderBooks] = useState<IMiniOrderBook | null>(null);
  const { orBooks, obFetching } = useOrderBook(filters);
  const [mode, setMode] = useState<Mode>("full");
  const [step, setStep] = useState(0.1);

  // useEffect(() => {
  //   if (!socketOB) return;

  //   setOrderBooks(socketOB);
  // }, [socketOB]);

  // useEffect(() => {
  //   if (!orBooks) return;
  //   setOrderBooks(orBooks);
  // }, [orBooks]);

  const orderBooks: IMiniOrderBook | null = useMemo(() => {
    if (socketOB) return socketOB;
    if (orBooks) return orBooks;
    return null;
  }, [socketOB, orBooks]);
  
  const displayRows = useMemo(() => {
    if (mode === "full") {
      return 10;
    } else if (mode === "bids") {
      return 20;
    } else if (mode === "asks") {
      return 20;
    } else {
      return 10;
    }
  }, [mode]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      symbol: id,
    }));
  }, [id]);

  // get last Price
  useEffect(() => {
    if (!ticker?.p) return;

    const prev = prevPriceRef.current;

    if (prev !== null) {
      if (ticker.p > prev) setPriceDirection("up");
      else if (ticker.p < prev) setPriceDirection("down");
      else setPriceDirection(null);
    }

    prevPriceRef.current = ticker.p;
  }, [ticker?.p]);

  const orderBookData = useMemo(() => {
    if (!orderBooks) {
      return {
        bidsWithTotal: [],
        asksWithTotal: [],
        maxBidPercentage: 0,
        maxAskPercentage: 0,
      };
    }

    return processOrderBookData(
      orderBooks.b || [],
      orderBooks.a || [],
      displayRows
    );
  }, [orderBooks, displayRows]);
  const spread = useMemo(() => {
    if (!orderBooks || !orderBooks.a[0] || !orderBooks.b[0]) {
      return null;
    }

    const askPrice = Number(orderBooks.a[0][0]);
    const bidPrice = Number(orderBooks.b[0][0]);

    return {
      value: askPrice - bidPrice,
      percentage: ((askPrice - bidPrice) / askPrice) * 100,
    };
  }, [orderBooks]);
  const renderRow = (i: IOrderBookRow, isAsk: boolean) => (
    <div
      className="relative grid grid-cols-3 text-sm py-[2px] px-1 hover:bg-secondary/50 transition-colors"
      key={i.p}
    >
      <div
        className={` inset-0 text-xsMedium ${isAsk ? "bar-asks" : "bar-bids"}`}
        style={{
          width: `${i.percentage * 100}%`,
          opacity: Math.min(
            0.8,
            (i.percentage /
              (isAsk
                ? orderBookData.maxAskPercentage
                : orderBookData.maxBidPercentage)) *
              0.8 +
              0.2
          ),
        }}
      />
      <div className={isAsk ? "text-red-500" : "text-green-500"}>
        {i.p.toFixed(1)}
      </div>
      <div className="text-right">{i.q.toFixed(3)}</div>
      <div className="text-right">{i.total.toFixed(3)}</div>
    </div>
  );
  return (
    <div className="bg-card-primary p-3 text-white  w-full h-[550px] ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {/* Mode icons */}
        <div className="flex gap-3 text-xl">
          <button onClick={() => setMode("full")}>
            <FullIcon currentColor={mode === "full" ? "#ffffff" : "#B3B3B3"} />
          </button>
          <button onClick={() => setMode("bids")}>
            <BidsIcon currentColor={mode === "bids" ? "#ffffff" : "#B3B3B3"} />
          </button>
          <button onClick={() => setMode("asks")}>
            <AskIcon currentColor={mode === "asks" ? "#ffffff" : "#B3B3B3"} />
          </button>
        </div>

        {/* Step selector */}

        <Select
          value={step}
          options={[
            { label: "0.1", value: 0.1 },
            { label: "0.01", value: 0.01 },
            { label: "0.001", value: 0.001 },
          ]}
          onChange={(v) => setStep(Number(v))}
          placeholder="Choose step..."
        />
      </div>

      {/* Orderbook */}
      <div className="grid grid-cols-3 text-xsRegular text-gray-500 mb-1 px-1">
        <span className="">Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Sum</span>
      </div>

      {obFetching ? (
        <SkeletonOrderBook />
      ) : (
        <div>
          {mode === "full" && (
            <div>
              <div>
                {orderBookData.asksWithTotal.map((ask, i) =>
                  renderRow(ask, true)
                )}
              </div>
              {mode === "full" && (
                <div className="bg-secondary/30">
                  <div className="text-center flex items-center  text-mdMedium">
                    <div className="flex items-center text-mdMedium ">
                      <span
                        className={
                          priceDirection === null
                            ? "text-white"
                            : priceDirection === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {ticker
                          ? Number(ticker?.p).toLocaleString("en-US")
                          : "---"}
                      </span>
                      {priceDirection === null ? null : priceDirection ===
                        "up" ? (
                        <ArrowUp className="text-green-500 ml-1" size={17} />
                      ) : (
                        <ArrowDown className="text-red-500 ml-1" size={17} />
                      )}
                    </div>
                    {spread && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Spread: {spread.percentage.toFixed(3)}%
                        <span className="ml-1 opacity-75">
                          ({spread.value.toFixed(2)})
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div>
                {orderBookData.bidsWithTotal.map((bid, i) =>
                  renderRow(bid, false)
                )}
              </div>
            </div>
          )}
          {mode === "bids" && (
            <div>
              {orderBookData.bidsWithTotal.map((i) => renderRow(i, true))}
            </div>
          )}
          {mode === "asks" && (
            <div>
              {orderBookData.asksWithTotal.map((i) => renderRow(i, false))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SkeletonOrderBook = () => {
  return (
    <div>
      {Array.from({ length: 19 }).map((_, idx) => (
        <div
          key={idx}
          className="relative grid grid-cols-3 text-sm py-[2px] px-1"
        >
          <div className="absolute inset-y-0 right-0" />

          <div className="text-left text-gray-500 animate-pulse">—</div>

          <div className="text-right text-gray-500 animate-pulse">—</div>

          <div className="text-right text-gray-500 animate-pulse">—</div>
        </div>
      ))}
    </div>
  );
};
export default memo(OrderBook);
