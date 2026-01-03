import { paths } from "@/routes/paths";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useExchangeInfo } from "../remote/useExchange";

export function useHeaderMenu() {
  const location = useLocation();
  const raw = localStorage.getItem("last-visit-symbol");

  const defaultValue = {
    state: { spotSymbol: "BTCUSDT" },
    version: 1,
  };

  const saved = raw ? JSON.parse(raw) : defaultValue;

  let symbol = saved.state.spotSymbol;

  if (location.pathname.includes("/exchange/")) {
    const parts = location.pathname.split("/");
    // Format: /exchange/[type]/[symbol]
    // parts: ["", "exchange", "spot", "BTCUSDT"] -> length 4
    if (parts.length >= 4) {
      symbol = parts[parts.length - 1];
    }
  }

  const { exInfo: allMarkets } = useExchangeInfo();
  let currentBase = "BTC";
  let currentQuote = "USDT";

  if (Array.isArray(allMarkets)) {
    const currentMarket = allMarkets.find((m) => m.symbol === symbol);
    if (currentMarket) {
      currentBase = currentMarket.baseAssetSymbol;
      currentQuote = currentMarket.quoteAssetSymbol;
    }
  }

  const getTargetSymbol = (type: "SPOT" | "FUTURES") => {
    if (Array.isArray(allMarkets)) {
      const match = allMarkets.find(
        (m) =>
          m.type === type &&
          m.baseAssetSymbol === currentBase &&
          m.quoteAssetSymbol === currentQuote
      );
      if (match) return match.symbol;

      const backup = allMarkets.find(
        (m) => m.type === type && m.baseAssetSymbol === currentBase
      );
      if (backup) return backup.symbol;

      if (type === "SPOT") return "BTCUSDT";
      if (type === "FUTURES") {
        const btcFut = allMarkets.find(
          (m) => m.type === "FUTURES" && m.baseAssetSymbol === "BTC"
        );
        return btcFut ? btcFut.symbol : "BTC_USDT";
      }
    }
    return symbol;
  };

  const spotTarget = getTargetSymbol("SPOT");
  const futuresTarget = getTargetSymbol("FUTURES");

  const menuItems = useMemo(
    () => [
      {
        title: "Perpetual",
        route: `${paths.exchange.futures}/${futuresTarget}`,
      },
      { title: "1001x", route: `${paths.exchange.one001x}/${futuresTarget}` },
      { title: "Spot", route: `${paths.exchange.spot}/${spotTarget}` },
      { title: "Profolio", route: paths.portfolio },
      { title: "Referrals", route: paths.referrals },
    ],
    [spotTarget, futuresTarget]
  );

  const active = useMemo(() => {
    const item = menuItems.find((i) => i.route === location.pathname);
    return item?.route ?? "";
  }, [location.pathname, menuItems]);

  return { menuItems, active, symbol };
}
