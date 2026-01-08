/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { BaseSocketService } from "./BaseSocket";
import type { ISocketService } from "./ISocketService";
type TickerCallback = (ticker: any) => void;
type MarkPriceCallback = (data: any) => void;
type IndexPriceCallback = (data: any) => void;
type FundingRateCallback = (data: any) => void;
type OrderBookCallback = (orderBook: any) => void;
type TradeCallback = (trade: any) => void;
type KlineCallback = (kline: any) => void;
type OrderUpdateCallback = (order: any) => void;
type BalanceUpdateCallback = (balance: any) => void;
type AllTickersCallback = (tickers: any[]) => void;
type PositionRiskCallback = (data: any) => void;
type AccountRiskCallback = (data: any) => void;

const EVENTS = {
  KLINE: "kline",
  TRADE: "trade",
  TICKER: "ticker",
  ORDERBOOK: "orderbook",
  ORDER_UPDATE: "order_update",
  BALANCE_UPDATE: "balance_update",
  ALL_SPOT_TICKERS: "all_spot_tickers",
  ALL_FUTURE_TICKERS: "all_future_tickers",
  POSITION_RISK: "position_risk",
  ACCOUNT_RISK: "account_risk",
  MARK_PRICE: "mark_price",
  INDEX_PRICE: "index_price",
  FUNDING_RATE: "funding_rate",
} as const;

type EventName = (typeof EVENTS)[keyof typeof EVENTS];

class SocketService extends BaseSocketService implements ISocketService {
  private static instance: SocketService;

  // Map: connection type → list of status callbacks
  private connectionListeners = new Map<
    "public" | "private",
    Set<(status: boolean) => void>
  >();

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // =========================================================
  // CONNECTION MANAGEMENT
  // =========================================================

  connectPublic(
    url: string = import.meta.env.VITE_WS_URL || "http://localhost:3000"
  ) {
    if (this.publicSocket?.connected) return;

    this.publicSocket = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    this.setupSocketListeners(this.publicSocket, "public", [
      EVENTS.KLINE,
      EVENTS.TRADE,
      EVENTS.TICKER,
      EVENTS.ORDERBOOK,
      EVENTS.ALL_SPOT_TICKERS,
      EVENTS.ALL_FUTURE_TICKERS,
      EVENTS.MARK_PRICE,
      EVENTS.FUNDING_RATE,
      EVENTS.INDEX_PRICE,
    ]);
  }

  connectPrivate(
    url: string = import.meta.env.VITE_WS_PRIVATE_URL ||
      "http://localhost:3000",
    token: string
  ) {
    if (this.privateSocket?.connected) return;

    this.privateSocket = io(url, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
    });

    this.setupSocketListeners(this.privateSocket, "private", [
      EVENTS.ORDER_UPDATE,
      EVENTS.BALANCE_UPDATE,
      EVENTS.POSITION_RISK,
      EVENTS.ACCOUNT_RISK,
    ]);
  }

  private setupSocketListeners(
    socket: Socket,
    type: "public" | "private",
    events: EventName[]
  ) {
    socket.on("connect", () => {
      console.log(
        `🟢 ${type === "public" ? "Public" : "Private"} Socket Connected`
      );
      this.updateConnectionStatus(type, true);

      if (type === "public") {
        this.resubscribeActiveTopics();
      }
    });

    socket.on("disconnect", () => {
      console.log(
        `🔴 ${type === "public" ? "Public" : "Private"} Socket Disconnected`
      );
      this.updateConnectionStatus(type, false);
    });

    // Register dynamic handlers for specified events
    events.forEach((event) => {
      socket.on(event, (data: any) => {
        this.dispatch(event, data);
      });
    });
  }

  private updateConnectionStatus(type: "public" | "private", status: boolean) {
    if (type === "public") this.isPublicConnected = status;
    else this.isPrivateConnected = status;

    this.connectionListeners.get(type)?.forEach((cb) => cb(status));
  }

  disconnect() {
    this.publicSocket?.disconnect();
    this.privateSocket?.disconnect();
    this.publicSocket = null;
    this.privateSocket = null;
    this.activePublicTopics.clear();
    this.listeners.clear();
  }

  disconnectPublic() {
    this.publicSocket?.disconnect();
    this.publicSocket = null;
    this.activePublicTopics.clear();
  }

  disconnectPrivate() {
    this.privateSocket?.disconnect();
    this.privateSocket = null;
  }

  onConnectionChange(
    type: "public" | "private",
    callback: (status: boolean) => void
  ): () => void {
    if (!this.connectionListeners.has(type)) {
      this.connectionListeners.set(type, new Set());
    }
    this.connectionListeners.get(type)!.add(callback);

    // Immediately notify with current status
    callback(
      type === "public" ? this.isPublicConnected : this.isPrivateConnected
    );

    return () => {
      this.connectionListeners.get(type)?.delete(callback);
    };
  }

  // =========================================================
  // SUBSCRIPTION MANAGEMENT
  // =========================================================

  subscribe(topics: string[]) {
    if (!this.publicSocket || !topics.length) return;

    const newTopics = topics.filter((t) => !this.activePublicTopics.has(t));
    if (newTopics.length === 0) return; // All already subscribed

    newTopics.forEach((t) => this.activePublicTopics.add(t));

    if (this.publicSocket.connected) {
      this.publicSocket.emit("subscribe", { topics: newTopics });
    }
  }

  unsubscribe(topics: string[]) {
    if (!this.publicSocket || !topics.length) return;

    topics.forEach((t) => this.activePublicTopics.delete(t));

    if (this.publicSocket.connected) {
      this.publicSocket.emit("unsubscribe", { topics });
    }
  }

  private resubscribeActiveTopics() {
    if (!this.publicSocket?.connected || this.activePublicTopics.size === 0)
      return;

    const topics = Array.from(this.activePublicTopics);
    console.log("Re-subscribing to topics:", topics);
    this.publicSocket.emit("subscribe", { topics });
  }

  // =========================================================
  // EVENT LISTENER MANAGEMENT
  // =========================================================

  // Public event subscriptions
  onTicker(cb: TickerCallback) {
    return this.addListener(EVENTS.TICKER, cb);
  }

  onMarkPrice(cb: MarkPriceCallback) {
    return this.addListener(EVENTS.MARK_PRICE, cb);
  }

  onIndexPrice(cb: IndexPriceCallback) {
    return this.addListener(EVENTS.INDEX_PRICE, cb);
  }

  onFundingRate(cb: FundingRateCallback) {
    return this.addListener(EVENTS.FUNDING_RATE, cb);
  }

  onOrderBook(cb: OrderBookCallback) {
    return this.addListener(EVENTS.ORDERBOOK, cb);
  }

  onTrade(cb: TradeCallback) {
    return this.addListener(EVENTS.TRADE, cb);
  }

  onKline(cb: KlineCallback) {
    return this.addListener(EVENTS.KLINE, cb);
  }

  onAllSpotTickers(cb: AllTickersCallback) {
    return this.addListener(EVENTS.ALL_SPOT_TICKERS, cb);
  }

  onAllFutureTickers(cb: AllTickersCallback) {
    return this.addListener(EVENTS.ALL_FUTURE_TICKERS, cb);
  }

  // Private event subscriptions (direct socket.io binding)
  onOrderUpdate(cb: OrderUpdateCallback) {
    return this.addListener(EVENTS.ORDER_UPDATE, cb);
  }

  onBalanceUpdate(cb: BalanceUpdateCallback) {
    return this.addListener(EVENTS.BALANCE_UPDATE, cb);
  }

  onPositionRisk(cb: PositionRiskCallback) {
    if (!this.privateSocket) return () => {};
    this.privateSocket.on(EVENTS.POSITION_RISK, cb);
    return () => this.privateSocket?.off(EVENTS.POSITION_RISK, cb);
  }

  onAccountRisk(cb: AccountRiskCallback) {
    if (!this.privateSocket) return () => {};
    this.privateSocket.on(EVENTS.ACCOUNT_RISK, cb);
    return () => this.privateSocket?.off(EVENTS.ACCOUNT_RISK, cb);
  }
}

// Export singleton instance
export const socketService = SocketService.getInstance();
