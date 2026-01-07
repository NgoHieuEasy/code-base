import PrimaryButton from "@/shared/components/button/primary-button";
import MarketStatsBar from "@/shared/components/exchange/market-stats-bar";
import OrderBook from "@/shared/components/exchange/order-book";
import TradeHistory from "@/shared/components/exchange/trade-history";
import TradeOrderPanel, { TradeOrderBody } from "@/shared/components/exchange/trade-order-panel";
import TradesBook from "@/shared/components/exchange/trades-book";
import TradingChart from "@/shared/components/exchange/trading-chart";
import TradingPairHeader from "@/shared/components/exchange/trading-pair-header";
import UnderlineTabs from "@/shared/components/tab/underline-tabs";
import { useExchangeInfo } from "@/shared/hooks/remote/useExchange";
import type { IExchangeInfo } from "@/shared/types/exchange";
import { MOBILE_SCREEN, TABLET_SCREEN } from "@/shared/utils/constants";
import { useExchangeStore } from "@/zustand/useExchangeStore";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";

export const SpotView = () => {
  const { setExInfo } = useExchangeStore();
  const { id } = useParams<{ id: string }>();
  const { exInfo } = useExchangeInfo({
    symbol: id,
    marketType: "SPOT",
  }) as { exInfo: IExchangeInfo };
  const isMobile = useMediaQuery({ query: `(max-width: ${MOBILE_SCREEN}px)` });
  const isTablet = useMediaQuery({
    query: `(min-width: ${MOBILE_SCREEN}px) and (max-width: ${TABLET_SCREEN}px)`,
  });
  const isDesktop = useMediaQuery({
    query: `(min-width: ${TABLET_SCREEN}px)`,
  });

  const [open, setOpen] = useState({
    trade: false,
  });

  useEffect(() => {
    if (exInfo) {
      setExInfo(exInfo);
    }
  }, [exInfo]);
  return (
    <div>
      <div className="flex flex-col gap-3 ">
        <TradingPairHeader marketType="SPOT" />
        {!isDesktop && <MarketStatsBar marketType="SPOT" />}
        <div className="flex gap-2">
          <div className="flex-1 ">
            <TradingChart className="lg:h-[639px] bg-card-primary " />
          </div>
          {isDesktop && (
            <div className="bg-card-primary lg:w-[273px] 2xl:w-[372px]">
              <UnderlineTabs
                defaultActiveKey="ORDER_BOOK"
                tabs={[
                  {
                    key: "ORDER_BOOK",
                    label: "Order book",
                    content: <OrderBook />,
                  },
                  {
                    key: "TRADES",
                    label: "Trades",
                    content: <TradesBook />,
                  },
                ]}
              />
            </div>
          )}

          {isDesktop && (
            <div className="bg-card-primary lg:w-[273px] 2xl:w-[372px]">
              <TradeOrderBody />
            </div>
          )}
        </div>

        {isTablet && (
          <div className="flex gap-2">
            <div className="bg-card-primary flex-1">
              <UnderlineTabs
                defaultActiveKey="ORDER_BOOK"
                tabs={[
                  {
                    key: "ORDER_BOOK",
                    label: "Order book",
                    content: <OrderBook />,
                  },
                  {
                    key: "TRADES",
                    label: "Trades",
                    content: <TradesBook />,
                  },
                ]}
              />
            </div>
            <div className="bg-card-primary w-[350px]">
              <TradeOrderBody />
            </div>
          </div>
        )}
        {isMobile && (
          <div className="bg-card-primary flex-1">
            <UnderlineTabs
              defaultActiveKey="ORDER_BOOK"
              tabs={[
                {
                  key: "ORDER_BOOK",
                  label: "Order book",
                  content: <OrderBook />,
                },
                {
                  key: "TRADES",
                  label: "Trades",
                  content: <TradesBook />,
                },
              ]}
            />
          </div>
        )}

        <TradeHistory marketType="SPOT" />

        {isMobile && (
          <div className="flex gap-2 bg-card-primary p-2">
            <PrimaryButton
              onClick={() => {
                setOpen((prev) => ({ ...prev, trade: true }));
              }}
              className="bg-green-600"
              text="Buy/Long"
            />
            <PrimaryButton
              onClick={() => {
                setOpen((prev) => ({ ...prev, trade: true }));
              }}
              className="bg-red-600"
              text="Sell/Short"
            />
          </div>
        )}

        {
          <TradeOrderPanel
            open={open.trade}
            onClose={() => setOpen((prev) => ({ ...prev, trade: false }))}
          />
        }
      </div>
    </div>
  );
};
