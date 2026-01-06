/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Socket } from "socket.io-client";

export type ConnectionType = "public" | "private";

export interface ISocketService {
  // =====================
  // Connection
  // =====================
  connectPublic(url?: string): void;
  connectPrivate(url: string, token: string): void;

  disconnect(): void;
  disconnectPublic(): void;
  disconnectPrivate(): void;

  onConnectionChange(
    type: ConnectionType,
    callback: (status: boolean) => void
  ): () => void;

  // =====================
  // Subscriptions
  // =====================
  subscribe(topics: string[]): void;
  unsubscribe(topics: string[]): void;

  // =====================
  // Events
  // =====================
  onTicker(cb: (data: any) => void): () => void;
  onMarkPrice(cb: (data: any) => void): () => void;
  onFundingRate(cb: (data: any) => void): () => void;
  onIndexPrice(cb: (data: any) => void): () => void;
  onOrderBook(cb: (data: any) => void): () => void;
  onTrade(cb: (data: any) => void): () => void;
  onKline(cb: (data: any) => void): () => void;
  onAllSpotTickers(cb: (data: any[]) => void): () => void;
  onAllFutureTickers(cb: (data: any[]) => void): () => void;

  // =====================
  // Private Events
  // =====================
  onOrderUpdate(cb: (data: any) => void): () => void;
  onBalanceUpdate(cb: (data: any) => void): () => void;
  onPositionRisk(cb: (data: any) => void): () => void;
  onAccountRisk(cb: (data: any) => void): () => void;

  // =====================
  // State
  // =====================
  publicSocket: Socket | null;
  privateSocket: Socket | null;
  isPublicConnected: boolean;
  isPrivateConnected: boolean;
}
