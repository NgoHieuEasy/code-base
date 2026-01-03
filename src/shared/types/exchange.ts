export interface IExchangeInfo {
  id: number;
  symbol: string;

  baseAssetSymbol: string;
  quoteAssetSymbol: string;

  type: "SPOT" | "FUTURES" | "MARGIN";
  status: "TRADING" | "HALT" | "DELISTED";

  pricePrecision: number;
  qtyPrecision: number;

  minQty: string;
  maxQty: string;
  stepSize: string;

  minNotional: string;
  maxNotional: string;

  takerFee: string;
  makerFee: string;

  maxLeverage: number;
  maintenanceMarginRate: string;
  fundingInterval: number | null;

  marketMakerProgram: boolean;

  logo: string;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
