import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { useExchangeStore } from "@/zustand/useExchangeStore";
import { useSocketTicker } from "@/shared/hooks/socket/useTicker";
import { useIndexPrice } from "@/shared/hooks/socket/useIndexPrice";
import { useMarkPrice } from "@/shared/hooks/socket/useMarkPrice";
import { useFundingRate } from "@/shared/hooks/socket/useFundingRate";
import { fNumber, formatVolume } from "@/shared/utils/format-number";
import { getCountdown } from "@/shared/utils/utilts";
import { useTicker } from "@/shared/hooks/remote/useExchange";


interface Props {
  marketType: "SPOT" | "FUTURES";
  className?: string;
}

export default function MarketStatsBar({ marketType, className }: Props) {
  // const data = useMarketStats();
  const { exInfo } = useExchangeStore();
  const { id } = useParams();
  const [ticker, setTicker] = useState<any>(null);
  const tickerSO = useSocketTicker(id as string);
  const { ticker: tickerAPI } = useTicker({ symbol: id });
  const markPrice = useMarkPrice(id as string, marketType === "FUTURES");
  const indexPrice = useIndexPrice(id as string, marketType === "FUTURES");
  const fundingRateData = useFundingRate(
    id as string,
    marketType === "FUTURES"
  );

  const prevPriceRef = useRef<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | null>(
    null
  );

  const fundingRate = useMemo(() => {
    return fundingRateData ? fundingRateData : null;
  }, [fundingRateData]);

  useEffect(() => {
    if (!tickerSO) return;
    setTicker(tickerSO);
  }, [tickerSO]);

  useEffect(() => {
    if (!tickerAPI) return;
    setTicker(tickerAPI);
  }, [tickerAPI]);

  useEffect(() => {
    if (!ticker?.p) return;

    const prev = prevPriceRef.current;

    if (prev !== null) {
      if (ticker.p > prev) setPriceDirection("up");
      else if (ticker.p < prev) setPriceDirection("down");
      else setPriceDirection(null);
    }

    // cập nhật giá cũ *sau khi so sánh*
    prevPriceRef.current = ticker.p;
  }, [ticker?.p]);

  return (
    <div className={twMerge(clsx(`w-full px-3 bg-card-primary`, className))}>
      <div className="flex overflow-x-auto gap-10  py-4">
        {/* Price + Change */}
        <div className="flex flex-col min-w-[130px] border-r-2 border-white/20">
          <span
            className={
              priceDirection === null
                ? "text-white"
                : priceDirection === "up"
                  ? "text-green-500"
                  : "text-red-500"
            }
          >
            {(
              Number(ticker?.p || 0) * Math.pow(1, exInfo?.pricePrecision || 0)
            ).toLocaleString("en-US")}
          </span>
          <span
            className={`text-[14px] ${Number(ticker?.C) > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {ticker
              ? `${ticker.C >= 0 ? "+" : ""}${
                  ticker.C
                } (${ticker?.P?.toFixed(2)}%)`
              : "---"}
          </span>
        </div>

        <div className="flex flex-col gap-2 ">
          <span className="text-[16px] text-white">
            {fNumber(ticker?.h ?? 0)}
          </span>
          <span className="text-xsMedium text-gray-500">24h High</span>
        </div>

        {/* lastPrice */}
        <div className="flex flex-col gap-2 ">
          <span className="text-[16px] text-white">
            {fNumber(ticker?.l ?? 0)}
          </span>
          <span className="text-xsMedium text-gray-500">24h Low</span>
        </div>

        <div className="flex flex-col gap-2 ">
          <span className="text-[16px] text-white">
            {formatVolume(Number(ticker?.V || 0))}
          </span>
          <span className="text-xsMedium text-gray-500">24h Volume</span>
        </div>

        {marketType === "FUTURES" && (
          <>
            <div className="flex flex-col gap-2 ">
              <span className="text-[16px] text-white">
                {fNumber(Number(markPrice || 0))}
              </span>
              <span className="text-xsMedium text-gray-500">Mark Price</span>
            </div>
            <div className="flex flex-col gap-2 ">
              <span className="text-[16px] text-white">
                {fNumber(Number(indexPrice || 0))}
              </span>
              <span className="text-xsMedium text-gray-500">Index Price</span>
            </div>
            <div className="flex flex-col gap-2 min-w-[110px]">
              <span className="text-[16px] text-white">
                {fundingRate?.r ?? 0}% / {getCountdown(fundingRate?.n ?? 0)}
              </span>
              <span className="text-xsMedium text-gray-500">
                Funding/Countdown
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
