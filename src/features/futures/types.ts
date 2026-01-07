export interface IFuturesAccount {
   marginCoin: string;
   balance: string;
   locked: string;
   available: string;
   equity: string;
   unrealizedPL: string;
   crossedUnrealizedPL: string;
   isolatedUnrealizedPL: string;
   crossedMargin: string;
   isolatedMargin: string;
   totalMargin: string;
   crossedMaxAvailable: string;
   maxTransferOut: string;
   crossedRiskRate: string;
}