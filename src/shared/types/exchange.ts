import type { MarginType, OrderSide, OrderStatus, OrderType, PositionSide, TimeInForce, TradeType } from "@/features/spot/types";

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


export interface IPosition {
  id: number;
  userId: number;
  symbol: string;
  side: 'LONG' | 'SHORT';
  positionSide: PositionSide;
  leverage: number;
  entryPrice: string;
  markPrice: string;
  exitPrice: string;
  closedAt: string;
  liquidationPrice: string;
  marginRatio: string;
  maintenanceMargin: string;
  size: string;
  margin: string;
  unrealizedPnl: string;
  takeProfit?: string;
  stopLoss?: string;
  realizedPnl: string;
  roe: string;
  marginType: MarginType;
  totalFees: string;
  status: 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}
export interface IOrder {
  id: number;
  orderId: string;
  userId: number;
  symbol: string;
  type: TradeType;
  side: OrderSide;
  orderType: OrderType;
  price?: string;
  quantity: string;
  filledQty: string;
  remainingQty: string;
  status: OrderStatus;
  timeInForce: TimeInForce;
  triggerPrice?: string;
  leverage?: number;
  positionSide?: PositionSide;
  reduceOnly?: boolean;
  createdAt: string;
}