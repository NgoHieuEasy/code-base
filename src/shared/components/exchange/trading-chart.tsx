/* eslint-disable */
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import { WebsocketService } from "@/services/websocket.service";
import { useCallback, useEffect, useRef } from "react";
import type {
  IChartingLibraryWidget,
  ResolutionString,
  TimeFrameItem,
  Timezone,
} from "public/static/charting_library/charting_library";
// import { ChartTopNav } from './top-nav';
import { useParams } from "react-router-dom";


import { useExchangeStore } from "@/zustand/useExchangeStore";
import { useChartStore } from "@/zustand/useChartStore";
import { useOpenOrders, usePositions } from "@/shared/hooks/remote/useExchange";
import { useChartTools } from "@/shared/hooks/local/useChartTool";
import { useOrderLines } from "@/shared/hooks/local/useOrderLines";
import { DISABLED_FEATURES, ENABLED_FEATURES, favorites, tvDarkOverrides, widgetOptionsDefault } from "@/shared/utils/constants";
import { socketService } from "@/shared/hooks/services/socket";
import type { WidgetOptions } from "./models";
import { Datafeed } from "./datafeed";
import ConfirmEditOrderModal from "@/features/futures/components/confirm-edit-order-modal";
import { ChartTopNav } from "./chart-top-nav";

dayjs.extend(utc);
dayjs.extend(timezone);

function getCurrentTimezone() {
  const timezone = dayjs.tz.guess();
  switch (timezone) {
    case "Asia/Saigon":
      return "Asia/Ho_Chi_Minh";
    default:
      return timezone;
  }
}

interface Props {
  className?: string;
}

const TradingChart = ({ className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const { positions } = usePositions();
  const { orders } = useOpenOrders({ status: "PENDING", symbol: id });


  const { timeframe, setIsChartReady, chartLoaded } = useChartStore();
  const { loadSavedTools, saveChartTools } = useChartTools();
  const { tvWidget, setTvWidget } = useOrderLines(id as string, positions || [], orders || []);
  const asset = {
    symbol: id ?? "",
    interval: timeframe,
    index_price: 1,
    mark_price: 1,
  };
  const { exInfo } = useExchangeStore();

  const setupChangeListeners = useCallback(
    (widget: IChartingLibraryWidget) => {
      const chart = widget.activeChart();
      const saveState = () => {
        saveChartTools(chart);
      };

      try {
        chart.onDataLoaded().subscribe(null, saveState);
        chart.onSymbolChanged().subscribe(null, saveState);
        // chart.onIntervalChanged().subscribe(null, () => {
        //   setTimeout(() => {
        //     setTimeframe(chart.resolution());
        //     updatePositions();
        //   }, 1000);
        //   saveState();
        // });
      } catch (error) {
        console.error('Error setting up chart listeners:', error);
      }

      const observer = new MutationObserver(() => {
        saveState();
      });

      const config = { attributes: true, childList: true, subtree: true };
      observer.observe(ref.current!, config);

      return () => {
        try {
          chart.onDataLoaded().unsubscribeAll(saveState);
          chart.onSymbolChanged().unsubscribeAll(saveState);
          chart.onIntervalChanged().unsubscribeAll(saveState);
        } catch (error) {
          console.error('Error removing chart listeners:', error);
        }
        try {
          observer.disconnect();
        } catch (e) {
          console.error(e);
        }
      };
    },
    [saveChartTools]
  );

  const initChart = useCallback(() => {
    if (!asset || !ref.current) {
      console.warn(
        "Asset or ref is not available. Skipping chart initialization."
      );
      return;
    }
    const timeFrames = [
      { text: "15m", resolution: "15", description: "15 Minutes" },
      { text: "1h", resolution: "60", description: "1 Hour" },
      { text: "4h", resolution: "240", description: "4 Hour" },
      { text: "1D", resolution: "5", description: "1 Day" },
    ];

    const defaultValue = {
      state: { defaultResolution: "15" },
    };

    const raw = localStorage.getItem("chart-settings");
    const saved = raw ? JSON.parse(raw) : defaultValue;
    const resolution = saved.state.defaultResolution;
    const supportTimezone = getCurrentTimezone() as Timezone;
    import("../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        const widgetOptions: WidgetOptions = {
          symbol: asset?.symbol,
          datafeed: Datafeed(asset, socketService, Number(exInfo?.pricePrecision ?? 2)) as never,
          container: ref.current as never,
          container_id: ref.current?.id as never,
          locale: "en",
          disabled_features: DISABLED_FEATURES,
          enabled_features: ENABLED_FEATURES,
          fullscreen: false,
          autosize: true,
          theme: "Dark",
          custom_css_url: "/static/pro.css",
          favorites,
          timezone: supportTimezone,
          ...widgetOptionsDefault,
          interval: resolution as ResolutionString,
          studies_overrides: {
            "volume.volume.color.0": "#ea4339",
            "volume.volume.color.1": "#0ECB81",
            "volume.volume.transparency": 50,
          },
          loading_screen: {
            backgroundColor: "#101015",
            foregroundColor: "#FFFFFF",
          },

          time_frames: timeFrames as TimeFrameItem[],
        };

        const widgetInstance = new Widget(widgetOptions);

        widgetInstance.onChartReady(async () => {
          setIsChartReady();
          widgetInstance.activeChart().getTimeScale().setRightOffset(30);

          widgetInstance.applyOverrides(tvDarkOverrides as any);
          setTvWidget(widgetInstance);

          const chart = widgetInstance.activeChart();

          try {
            await loadSavedTools(chart);
          } catch (error) {
            console.error('Error loading saved state:', error);
          }

          const chartChangedHandler = () => {
            saveChartTools(chart);
          };



          widgetInstance.subscribe('study', () => {
            setTimeout(() => saveChartTools(chart), 1000);
          });
          widgetInstance.subscribe('onAutoSaveNeeded', chartChangedHandler);
          const cleanup = setupChangeListeners(widgetInstance);
          setIsChartReady();
          chartLoaded();

          return () => {
            cleanup();
            widgetInstance.unsubscribe('onAutoSaveNeeded', chartChangedHandler);
          };
        });
      }
    );
  }, [id, setupChangeListeners]);

  useEffect(() => {
    (window as any).tvWidget = null;
    initChart();

    return () => {
      if ((window as any).tvWidget !== null) {
        (window as any).tvWidget?.remove();
        (window as any).tvWidget = null;
      }
    };
  }, [id]);



  return (
    <div
      className={twMerge(
        clsx(`h-[345px]  flex flex-col items-center justify-center`, className)
      )}
    >
      <ChartTopNav tvWidget={tvWidget} />
      <ConfirmEditOrderModal />

      <div
        ref={ref}
        className="canvas-chart"
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          marginTop: "4px",
          marginBottom: "4px",
        }}
      />
    </div>
  );
};

export default TradingChart;
