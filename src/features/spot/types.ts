// Basic Enums
export type OrderSide = "BUY" | "SELL";
export type OrderType = "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET";
export type OrderStatus =
  | "PENDING"
  | "PARTIAL"
  | "FILLED"
  | "CANCELLED"
  | "REJECTED";
export type TimeInForce = "GTC" | "IOC" | "FOK" | "GTX";
export type TradeType = "SPOT" | "FUTURES";
export type PositionSide = "LONG" | "SHORT" | "BOTH";
export type MarginType = "CROSS" | "ISOLATED";

export interface IWallet {
  id: number;
  userId: number;
  assetSymbol: string;
  type: "SPOT" | "FUTURES" | "LOCKED";
  balance: string;
  frozenBalance: string;
}

export interface ICreateOrder {
  symbol: string;
  type: TradeType;
  side: OrderSide;
  orderType: OrderType;
  price?: string;
  quantity: string;
  timeInForce?: TimeInForce;
  triggerPrice?: string;
  leverage?: number;
  positionSide?: PositionSide;
  reduceOnly?: boolean;
  clientOrderId?: string;
}
