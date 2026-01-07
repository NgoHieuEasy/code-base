import { useState, useMemo, useEffect, memo } from "react";
import ArrowUpIcon from "@/assets/icons/exchange/arrow-up-icon";
import ArrowDownIcon from "@/assets/icons/exchange/arrow-down-icon";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useSocketAllFutureTickers, useSocketAllSpotTickers } from "@/shared/hooks/socket/useTikcerAll";
import { useTickers } from "@/shared/hooks/remote/useExchange";
import VirtualizedList from "./virtualized-list";

type Market = {
  s: string;
  p: number;
  C: number;
  P: number;
  logo: string;
  category: string;
};

// Row được memo hóa
const MarketRow = memo(
  ({ item, onClick }: { item: Market; onClick?: () => void }) => {
    return (
      <div
        className="flex justify-between items-center p-3 hover:bg-[#2c333c] cursor-pointer"
        onClick={() => {
          if (!onClick) return;
          onClick();
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <img src={item.logo} className="w-9 h-9 rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.s}</span>
            </div>
            <span className="text-gray-400 text-sm">{item.category}</span>
          </div>
        </div>

        {/* Right */}
        <div className="text-right">
          <p className="font-semibold">{item.p.toLocaleString()}</p>
          <p
            className={`text-sm ${
              item.P >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {item.P >= 0 ? "+" : ""}
            {item.P}%
          </p>
        </div>
      </div>
    );
  }
);

interface Props {
  marketType: "SPOT" | "FUTURES";
  onClick?: () => void;
}

const MarketList = ({ onClick, marketType }: Props) => {
  const navigate = useNavigate();

  const spotTickers = useSocketAllSpotTickers({
    enabled: marketType === "SPOT",
  });

  const futureTickers = useSocketAllFutureTickers({
    enabled: marketType === "FUTURES",
  });

  const socketTickers = marketType === "SPOT" ? spotTickers : futureTickers;
  // console.log(allTickers);

  const { tickers } = useTickers({
    marketType,
  });

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"symbol" | "price" | "change" | null>(
    null
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    if (tickers) {
      setMarkets(tickers);
    }
  }, [tickers]);

  useEffect(() => {
    if (
      !socketTickers ||
      !Array.isArray(socketTickers) ||
      markets.length === 0
    ) {
      return;
    }

    const tickerMap = new Map(
      socketTickers.map((item: any) => [item.s, { C: item.C, p: item.p }])
    );

    setMarkets((prevAssets) => {
      const updated = prevAssets.map((asset) => {
        const ticker = tickerMap.get(asset.s);
        if (ticker && (asset.C !== ticker.C || asset.p !== ticker.p)) {
          return { ...asset, C: ticker.C, p: ticker.p };
        }
        return asset;
      });

      // Only update if something changed
      return updated.some((asset, index) => asset !== prevAssets[index])
        ? updated
        : prevAssets;
    });
  }, [socketTickers]);

  // --- Filter + Sort ---
  const sortedData = useMemo(() => {
    let filtered = markets;

    if (query.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.s.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (!sortKey) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortKey as keyof Market];
      let bVal = b[sortKey as keyof Market];
      if (sortKey === "symbol") {
        aVal = a.s;
        bVal = b.s;
      } else if (sortKey === "price") {
        aVal = a.p;
        bVal = b.p;
      } else if (sortKey === "change") {
        aVal = a.P;
        bVal = b.P;
      }

      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return sorted;
  }, [query, sortKey, sortDir, markets]);

  const handleSort = (key: "symbol" | "price" | "change") => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 text-white">
      {/* Search */}
      <div className="relative w-full mb-4">
        <input
          className="w-full bg-[#151D27] text-white px-4 py-3 rounded-xl outline-none placeholder-gray-400"
          placeholder="Search Market"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <button
          className="flex items-center gap-1"
          onClick={() => handleSort("symbol")}
        >
          {" "}
          <span>Symbols</span>{" "}
          <div>
            {" "}
            <ArrowUpIcon
              currentColor={
                sortKey === "symbol" && sortDir === "asc"
                  ? "#ffffff"
                  : "#808080"
              }
            />{" "}
            <ArrowDownIcon
              currentColor={
                sortKey === "symbol" && sortDir === "desc"
                  ? "#ffffff"
                  : "#808080"
              }
            />{" "}
          </div>{" "}
        </button>
        <div className="flex">
          <button
            className="flex items-center gap-1"
            onClick={() => handleSort("price")}
          >
            {" "}
            <span>Price</span>{" "}
            <div>
              {" "}
              <ArrowUpIcon
                currentColor={
                  sortKey === "price" && sortDir === "asc"
                    ? "#ffffff"
                    : "#808080"
                }
              />{" "}
              <ArrowDownIcon
                currentColor={
                  sortKey === "price" && sortDir === "desc"
                    ? "#ffffff"
                    : "#808080"
                }
              />{" "}
            </div>{" "}
          </button>{" "}
          <button
            className="flex items-center gap-1"
            onClick={() => handleSort("change")}
          >
            {" "}
            <span> / Change</span>{" "}
            <div>
              {" "}
              <ArrowUpIcon
                currentColor={
                  sortKey === "change" && sortDir === "asc"
                    ? "#ffffff"
                    : "#808080"
                }
              />{" "}
              <ArrowDownIcon
                currentColor={
                  sortKey === "change" && sortDir === "desc"
                    ? "#ffffff"
                    : "#808080"
                }
              />{" "}
            </div>{" "}
          </button>
        </div>
      </div>
      {/* LIST */}{" "}
      <div className="space-y-4">
        {" "}
        {sortedData.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
        ) : (
          <VirtualizedList
            items={sortedData}
            itemHeight={70}
            windowHeight={600}
            renderItem={(item) => (
              <MarketRow
                item={item}
                onClick={() => {
                  const data = {
                    state: {
                      spotSymbol: item.s,
                    },
                  };
                  localStorage.setItem(
                    "last-visit-symbol",
                    JSON.stringify(data)
                  );
                  navigate(
                    `${
                      marketType === "SPOT"
                        ? paths.exchange.spot
                        : paths.exchange.futures
                    }/${item.s}`,
                    {
                      replace: true,
                    }
                  );
                  // tvWidget
                  //   ?.activeChart()
                  //   .setSymbol(item.initSymbol as ResolutionString);
                  if (!onClick) return;
                  onClick();
                }}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};
const SkeletonRow = () => {
  return (
    <div className="flex justify-between items-center p-3 animate-pulse">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-700 rounded-full" />

        <div className="space-y-2">
          <div className="w-20 h-3 bg-gray-700 rounded" />
          <div className="w-14 h-3 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Right */}
      <div className="text-right space-y-2">
        <div className="w-16 h-3 bg-gray-700 rounded ml-auto" />
        <div className="w-10 h-3 bg-gray-800 rounded ml-auto" />
      </div>
    </div>
  );
};
export default memo(MarketList);
