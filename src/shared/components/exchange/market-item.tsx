import { Star, ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useExchangeStore } from "@/zustand/useExchangeStore";
import { TABLET_SCREEN } from "@/shared/utils/constants";
import MarketStatsBar from "./market-stats-bar";

interface Props {
  marketType: "SPOT" | "FUTURES";
  onClick: () => void;
}

export default function MarketItem({ onClick, marketType }: Props) {
  const isDesktop = useMediaQuery({
    query: `(min-width: ${TABLET_SCREEN}px)`,
  });
  const { exInfo } = useExchangeStore();
  return (
    <div className="w-full bg-card-primary px-4 py-4 md:py-0 rounded-xl flex items-center  ">
      <div className="  rounded-xl flex items-center gap-2 mr-4 ">
        <Star size={18} className="text-gray-400" />

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onClick}
        >
          <img
            src={exInfo?.logo}
            alt={exInfo?.symbol}
            className="w-8 h-8 rounded-full"
          />

          <div className="flex flex-col">
            <span className="text-white text-xsBold]">{exInfo?.symbol}</span>
            <span className="text-gray-500 text-ssMedium ">
              {exInfo?.baseAssetSymbol}
            </span>
          </div>
        </div>

        <ArrowUpRight size={25} className="text-gray-500 md:ml-2" />
      </div>

      {isDesktop && <MarketStatsBar marketType={marketType} />}
    </div>
  );
}
