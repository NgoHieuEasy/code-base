import { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import PrimaryButton from "../button/primary-button";
import PanelPopup from "../popup/panel-popup";
import UnderlineTabs from "../tab/underline-tabs";

interface Props {
  open: boolean;
  onClose: () => void;
}
const TradeOrderPanel = ({ open, onClose }: Props) => {
  return (
    <div>
      {open && (
        <PanelPopup open={open} onClose={onClose}>
          <TradeOrderBody />
        </PanelPopup>
      )}
    </div>
  );
};

interface ITradeOrderProps {
  className?: string;
}

export const TradeOrderBody = ({ className }: ITradeOrderProps) => {
  const [actived, setActived] = useState("BUY");

  return (
    <div className={twMerge(clsx(`p-3  h-full rounded-lg`, className))}>
      <div className="flex gap-2">
        <PrimaryButton
          onClick={() => {
            setActived("BUY");
          }}
          className={`${actived === "BUY" ? "bg-green-600/30" : "bg-[#19222b] text-gray-500"}`}
          text="Buy"
        />
        <PrimaryButton
          onClick={() => {
            setActived("SELL");
          }}
          className={`${actived === "SELL" ? "bg-red-600/30" : "bg-[#19222b] text-gray-500"}`}
          text="Sell"
        />
      </div>
      <div className="mt-2">
        <UnderlineTabs
          defaultActiveKey="LIMIT"
          tabs={[
            {
              key: "LIMIT",
              label: "Limit",
              content: <TradeSpotLimit orderType={actived} />,
            },
            {
              key: "MARKET",
              label: "Market",
              content: <TradeSpotMarket orderType={actived} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TradeOrderPanel;
