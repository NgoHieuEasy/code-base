import type {
  AvailableSaveloadVersions,
  ResolutionString,
} from "public/static/charting_library/charting_library";

export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const LOGOUT_REQUIRED = "LOGOUT_REQUIRED";
export const MOBILE_SCREEN = 640;
export const TABLET_SCREEN = 1024;
export const LANGUAGE = "LANGUAGE";

export const ENABLED_FEATURES = ["show_spread_operators", "header_resolutions"];

export const DISABLED_FEATURES = [
  "header_compare",
  "header_symbol_search",
  "symbol_info",
  // "volume_force_overlay",
  "symbol_search_hot_key",
  "display_market_status",
  "compare_symbol",
  "show_interval_dialog_on_key_press",
  "header_widget",
  "header_settings",
  "header_undo_redo",
  "header_screenshot",
  "header_saveload",
];
export const timeframes = {
  "1m": "1",
  "3m": "3",
  "5m": "5",
  "15m": "15",
  "30m": "30",
  "1h": "60",
  "2h": "120",
  "4h": "240",
  "1D": "1D",
  "1W": "1W",
  "1M": "1M",
};
export const CHART_TYPES = {
  BARS: 0,
  CANDLES: 1,
  LINE: 2,
  AREA: 3,
  HEIKIN_ASHI: 8,
  HOLLOW_CANDLES: 9,
  BASELINE: 10,
};

export const showOrdersOptions: { label: string; key: string }[] = [
  {
    label: "Position",
    key: "position",
  },
  {
    label: "Limit Order",
    key: "limitOrder",
  },
  {
    label: "TP/SL",
    key: "tpSl",
  },
];
export const favorites = {
  intervals: [
    "1" as ResolutionString,
    "3" as ResolutionString,
    "5" as ResolutionString,
    "15" as ResolutionString,
    "30" as ResolutionString,
    "60" as ResolutionString,
    "120" as ResolutionString,
    "240" as ResolutionString,
    "1D" as ResolutionString,
    "1W" as ResolutionString,
    "1M" as ResolutionString,
  ],
  chartTypes: [],
};
export const TRADING_VIEW_DEFAULTS = {
  LIBRARY_PATH: "/static/charting_library/",
  CHARTS_STORAGE_URL: "https://saveload.tradingview.com",
  CHARTS_STORAGE_API_VERSION: "1.1",
  CLIENT_ID: "tradingview.com",
  USER_ID: "public_user_id",
  CONTAINER_ID_SPOT: "tv_chart_container",
  INTERVAL: "60",
} as const;
export const widgetOptionsDefault = {
  // interval: TRADING_VIEW_DEFAULTS.INTERVAL as ResolutionString,
  library_path: TRADING_VIEW_DEFAULTS.LIBRARY_PATH as string,
  charts_storage_url: TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_URL as string,
  charts_storage_api_version:
    TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_API_VERSION as AvailableSaveloadVersions,
  client_id: TRADING_VIEW_DEFAULTS.CLIENT_ID as string,
  user_id: TRADING_VIEW_DEFAULTS.USER_ID as string,
};
export const tvDarkOverrides = {
  "mainSeriesProperties.candleStyle.wickUpColor": "#0ECB81",
  "mainSeriesProperties.candleStyle.wickDownColor": "#EA3943",
  "mainSeriesProperties.candleStyle.upColor": "#0ECB81",
  "mainSeriesProperties.candleStyle.downColor": "#EA3943",
  "mainSeriesProperties.candleStyle.borderDownColor": "#EA3943",
  "mainSeriesProperties.candleStyle.borderUpColor": "#0ECB81",

  "paneProperties.background": "#0D1620",
  "paneProperties.backgroundType": "solid",
  "paneProperties.vertGridProperties.color": "rgba(140, 140, 140, 0.1)",
  "paneProperties.horzGridProperties.color": "rgba(140, 140, 140, 0.1)",
  "paneProperties.legendProperties.showStudyArguments": true,
  "paneProperties.legendProperties.showStudyTitles": true,
  "paneProperties.legendProperties.showStudyValues": true,
  "paneProperties.legendProperties.showSeriesTitle": true,
  "paneProperties.legendProperties.showSeriesOHLC": true,
  "paneProperties.legendProperties.showLegend": true,
  "paneProperties.legendProperties.showBarChange": true,
  "paneProperties.legendProperties.showBackground": true,
  "paneProperties.legendProperties.backgroundTransparency": 10,
  "paneProperties.separatorColor": "#FFFFFF",

  "mainSeriesProperties.hollowCandleStyle.drawWick": true,
  "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
  "mainSeriesProperties.candleStyle.drawBorder": true,
  "mainSeriesProperties.haStyle.drawWick": true,
  "mainSeriesProperties.haStyle.drawBorder": true,

  "scalesProperties.backgroundColor": "#0D1620",
  "scalesProperties.fontSize": 12,
  "scalesProperties.textColor": "#FFFFFF",

  "mainSeriesProperties.priceLineVisible": true,
  "mainSeriesProperties.crossHairMarkerVisible": true,

  "mainSeriesProperties.statusViewStyle.background": "#00FF00",
  "mainSeriesProperties.statusViewStyle.borderColor": "#0D1620",
  "scalesProperties.scaleMargins": {
    top: 0.1,
    bottom: 0.1,
    right: 0,
  },
  "paneProperties.padding": 0,
};
