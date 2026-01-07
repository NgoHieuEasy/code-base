import { useState } from "react";
import HistoryTab from "./history-tab";
import TradeHistoryBody from "./trade-history-body";

interface Props {
  marketType?: "SPOT" | "FUTURES";
}

const TradeHistory = ({ marketType = "SPOT" }: Props) => {
  const [activeTab, setActiveTab] = useState("Open orders");

  return (
    <div className="flex flex-col gap-2 bg-card-primary px-2 rounded pb-3">
      <HistoryTab value={activeTab} onChange={setActiveTab} marketType={marketType} />
      <TradeHistoryBody activeTab={activeTab} marketType={marketType} />
      {/* Pagination can be connected to body if needed */}
      {/* <Pagination
        currentPage={Number(1)}
        totalPages={1}
        onPageChange={(page: number) => {}}
      /> */}
    </div>
  );
};

export default TradeHistory;
