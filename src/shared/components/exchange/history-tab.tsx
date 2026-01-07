import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import { TABLET_SCREEN } from "@/shared/utils/constants";
import Select from "../form/select";

const options = [
  { label: "Positions", value: "Positions" },
  { label: "Positions history", value: "Positions history" },
  { label: "Open orders", value: "Open orders" },
  { label: "Orders history", value: "Orders history" },
  { label: "Trade history", value: "Trade history" },
  { label: "Transaction history", value: "Transaction history" },
  { label: "Deposits & withdrawals", value: "Deposits & withdrawals" },
  { label: "Assets", value: "Assets" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  marketType?: "SPOT" | "FUTURES";
}

const HistoryTab = ({ value, onChange, marketType = "SPOT" }: Props) => {
  const isDesktop = useMediaQuery({
    query: `(min-width: ${TABLET_SCREEN}px)`,
  });

  // Filter options based on marketType
  const filteredOptions = options.filter(opt => {
    if (marketType === "SPOT" && opt.value === "Positions") return false;
    return true;
  });

  return (
    <div className="bg-card-primary flex justify-between items-center h-14">
      {isDesktop ? (
        <DesktopTab value={value} onChange={onChange} options={filteredOptions} />
      ) : (
        <Select
          value={value}
          options={filteredOptions}
          onChange={(v) => onChange(String(v))}
          placeholder="Choose step..."
          className="border-none bg-transparent"
        />
      )}

      <HideOtherSymbolsToggle />
    </div>
  );
};

interface DesktopProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const DesktopTab = ({ value, onChange, options }: DesktopProps) => {
  return (
    <div className="w-full  py-2">
      <div className="flex gap-2 overflow-x-auto">
        {options.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={clsx(
                "px-4 py-2 rounded-md text-smSemiBold whitespace-nowrap transition",
                isActive
                  ? "bg-[#19222b] text-white shadow"
                  : "text-gray-500 hover:text-white hover:bg-[#121a25]"
              )}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const HideOtherSymbolsToggle = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex w-full items-center gap-2 justify-end p-4 rounded-xl ">
      <label
        className={clsx(
          "flex items-center gap-4 cursor-pointer select-none rounded-lg transition"
        )}
      >
        {/* Checkbox */}
        <div
          onClick={() => setChecked(!checked)}
          className={clsx(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition",
            checked ? "border-brand-500 bg-brand-500" : "border-white"
          )}
        >
          {checked && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              className="w-4 h-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </label>
      {/* Label */}
      <span className="text-gray-100 text-smSemiBold">Hide other symbols</span>
    </div>
  );
};

export default HistoryTab;
