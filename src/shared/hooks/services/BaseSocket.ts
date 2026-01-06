/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Socket } from "socket.io-client";

export abstract class BaseSocketService {
  public publicSocket: Socket | null = null;
  public privateSocket: Socket | null = null;

  public isPublicConnected = false;
  public isPrivateConnected = false;

  protected activePublicTopics = new Set<string>();
  protected listeners = new Map<string, Set<any>>();

  abstract connectPublic(url?: string): void;
  abstract connectPrivate(url: string, token: string): void;

  abstract disconnect(): void;
  abstract disconnectPublic(): void;
  abstract disconnectPrivate(): void;

  subscribe(topics: string[]) {
    if (!this.publicSocket || !topics.length) return;

    const newTopics = topics.filter(t => !this.activePublicTopics.has(t));
    if (!newTopics.length) return;

    newTopics.forEach(t => this.activePublicTopics.add(t));
    this.publicSocket.emit("subscribe", { topics: newTopics });
  }

  unsubscribe(topics: string[]) {
    if (!this.publicSocket || !topics.length) return;

    topics.forEach(t => this.activePublicTopics.delete(t));
    this.publicSocket.emit("unsubscribe", { topics });
  }

  protected addListener(event: string, cb: any): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(cb);

    return () => this.listeners.get(event)?.delete(cb);
  }

  protected dispatch(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}
