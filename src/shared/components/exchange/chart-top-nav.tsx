import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";

import { CandlestickChart, ChevronDown, ChevronDownIcon } from "lucide-react";
import { useLocalStorage } from "@/zustand/useLocalStorage";
import { CHART_TYPES, timeframes } from "@/shared/utils/constants";
import { useChartStore } from "@/zustand/useChartStore";
import type {
  IChartingLibraryWidget,
  ResolutionString,
} from "public/static/charting_library/charting_library";

const chartTypeOptions = [
  {
    value: CHART_TYPES.BARS,
    label: "Bars",
    icon: (
      <img
        height={20}
        width={20}
        alt="bar chart icon"
        src="/svg/icon-chart-type.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.CANDLES,
    label: "Candles",
    icon: (
      <img
        height={20}
        width={20}
        alt="candles chart icon"
        src="/svg/icon-candles.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.HOLLOW_CANDLES,
    label: "Hollow candles",
    icon: (
      <img
        height={20}
        width={20}
        alt="hollow candles chart icon"
        src="/svg/icon-candles.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.LINE,
    label: "Line",
    icon: (
      <img
        height={20}
        width={20}
        alt="line chart icon"
        src="/svg/icon-line.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.AREA,
    label: "Area",
    icon: (
      <img
        height={20}
        width={20}
        alt="area chart icon"
        src="/svg/icon-area.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.BASELINE,
    label: "Baseline",
    icon: (
      <img
        height={20}
        width={20}
        alt="baseline chart icon"
        src="/svg/icon-baseline.svg"
      />
    ),
  },
  {
    value: CHART_TYPES.HEIKIN_ASHI,
    label: "Heikin-Ashi",
    icon: <CandlestickChart size="20px" />,
  },
];

interface IChartTopNav {
  tvWidget: IChartingLibraryWidget | null;
}


export const ChartTopNav = ({ tvWidget }: IChartTopNav) => {
  const { timeframe, setTimeframe } = useChartStore();
  const [showChartOrders, setShowChartOrders] = useLocalStorage(
    "SHOW_CHART_ORDERS",
    {}
  );

  const defaultValue = {
    state: { defaultResolution: "15" },
  };

  const saved = useMemo(() => {
    const raw = localStorage.getItem("chart-settings");
    return raw ? JSON.parse(raw) : defaultValue;
  }, []);

  const resolution = saved.state.defaultResolution;

  useEffect(() => {
    if (!resolution) return;
    setTimeframe(resolution);
  }, []);

  useEffect(() => {
    if (JSON.stringify(showChartOrders) === "{}") {
      setShowChartOrders({
        position: true,
        limitOrder: true,
        tpSl: true,
      });
    }
  }, []);
  useEffect(() => {
    if (JSON.stringify(showChartOrders) === "{}") {
      setShowChartOrders({
        position: true,
        limitOrder: true,
        tpSl: true,
      });
    }
  }, []);

  const [activeChartType, setActiveChartType] = useState({
    value: CHART_TYPES.CANDLES,
    label: "Candles",
    icon: (
      <img
        height={20}
        width={20}
        alt="candle chart icon"
        src="/svg/icon-candles.svg"
      />
    ),
  });

  return (
    <div className="h-[45px] w-full flex  gap-3.5 px-2.5 items-center pl-5  bg-background rounded-md">
      {Object.entries(timeframes).map(([key, value], i) => (
        <button
          key={key}
          className={` text-xsBold ${
            timeframe === value ? "text-white " : "text-gray-500"
          } ${i <= 2 ? "" : "hidden md:flex items-center justify-center"} `}
          onClick={() => {
            setTimeframe(value);
            const data = {
              state: {
                defaultResolution: value,
              },
            };
            localStorage.setItem("chart-settings", JSON.stringify(data));
            tvWidget?.activeChart().setResolution(value as ResolutionString);
          }}
        >
          {key}
        </button>
      ))}
      <Popover>
        <PopoverTrigger className="md:hidden flex">
          <div
            className={`rounded text-xs flex items-center
             justify-center opacity-70 hover:opacity-100 text-white w-fit ${
               timeframe !== "1" && timeframe !== "3" && timeframe !== "5"
                 ? "text-white"
                 : "text-font-70"
             }`}
          >
            {timeframe !== "1" && timeframe !== "3" && timeframe !== "5"
              ? Object.entries(timeframes)?.find(
                  (entry) => entry[1] === timeframe
                )?.[0]
              : "More"}
            <ChevronDownIcon className="text-white text-xs min-w-[18px] ml-[1px]" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={14}
          className="flex flex-row flex-wrap p-3 z-[102] gap-2.5 rounded-b-md w-[200px] whitespace-nowrap bg-card-primary border border-borderColor shadow-xl"
        >
          {Object.entries(timeframes).map(([key, value], i) => (
            <button
              key={key}
              className={`text-xs ${
                timeframe === value ? "text-white" : "text-font-70"
              }
                 w-[50px] h-[30px] ${
                   i > 2 ? "flex items-center justify-center" : "hidden"
                 } bg-terciary rounded-md
                `}
              onClick={() => {
                setTimeframe(value);
                const data = {
                  state: {
                    defaultResolution: value,
                  },
                };
                localStorage.setItem("chart-settings", JSON.stringify(data));
                tvWidget
                  ?.activeChart()
                  .setResolution(value as ResolutionString);
              }}
            >
              {key}
            </button>
          ))}
        </PopoverContent>
      </Popover>
      <button
        className="opacity-70 hover:opacity-100"
        onClick={() => {
          tvWidget?.activeChart().executeActionById("insertIndicator");
        }}
      >
        <img src="/svg/icon-indicator.svg" />
      </button>
      <button
        className="opacity-70 hover:opacity-100"
        onClick={() => {
          tvWidget?.activeChart().executeActionById("chartProperties");
        }}
      >
        <img src="/svg/icon-settings.svg" />
      </button>
      <Popover>
        <PopoverTrigger>
          <div
            className="rounded text-xs flex items-center
             justify-center opacity-70 hover:opacity-100 w-fit"
          >
            {activeChartType?.icon}
            <ChevronDown className="text-white text-xs min-w-[18px] ml-[1px]" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={12}
          className="flex flex-col py-3 z-[102] rounded-b-md w-[240px] whitespace-nowrap bg-card-primary border border-borderColor shadow-xl"
        >
          {chartTypeOptions.map((entry, i) => (
            <button
              key={i}
              className={`h-[22px] px-5 ${
                activeChartType?.value === entry.value ? "" : "opacity-70"
              } hover:opacity-100 text-white w-fit px-1 my-2.5 text-sm flex items-center`}
              onClick={() => {
                setActiveChartType(entry);
                const mainSeries = tvWidget?.activeChart().getSeries();
                mainSeries?.setChartStyleProperties(entry?.value, {});
                tvWidget?.applyOverrides({
                  "mainSeriesProperties.style": entry?.value,
                  "mainSeriesProperties.lineStyle.color": "#836EF9",
                  "mainSeriesProperties.lineStyle.width": 1,
                });
              }}
            >
              <div>{entry?.icon}</div>
              <p className="ml-2.5">{entry?.label}</p>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      {/* <Popover>
        <PopoverTrigger>
          <div
            className="rounded text-xs flex items-center
             justify-center opacity-70 hover:opacity-100 w-fit"
          >
            <img src="/svg/icon-hide.svg" />
            <ChevronDown className="text-white text-xs min-w-[18px] ml-[1px]" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={12}
          className="flex flex-col py-3 z-[102] rounded-b-md w-[240px] whitespace-nowrap bg-secondary border border-borderColor shadow-xl"
        >
          <div className="flex flex-col px-5">
            {showOrdersOptions.map((entry) => (
              <button
                key={entry?.label}
                className="flex items-center w-full justify-between text-white my-2.5 text-sm"
                onClick={() => {
                  setShowChartOrders({
                    ...showChartOrders,
                    [entry.key]:
                      !showChartOrders[entry.key as keyof ChartOrderStorage],
                  });
                }}
              >
                <p>{entry?.label}</p>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showChartOrders[entry.key]}
                    onChange={() => {}}
                  />
                  <div
                    className="
      w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-blue-600
      relative transition
    "
                  >
                    <div
                      className="
        absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full transition
        peer-checked:translate-x-5
      "
                    ></div>
                  </div>
                </label>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};
