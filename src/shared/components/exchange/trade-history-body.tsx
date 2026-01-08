/* eslint-disable */
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { IOrder, IPosition, ITradeHistory } from "@/shared/types/exchange";
import { useSocketBalanceUpdate } from "@/shared/hooks/socket/useBalanceUpdate";
import { useSocketOrderUpdate } from "@/shared/hooks/socket/useOrderUpdate";
import {
  cancelOrder,
  useOpenOrders,
  usePositionHistory,
  usePositions,
  useTrades,
  useTransactions,
} from "@/shared/hooks/remote/useExchange";
import { useRiskData } from "@/shared/hooks/socket/useRiskData";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateQueries } from "@/shared/hooks/local/useRefreshData";
import { fNumber } from "@/shared/utils/format-number";
import { fDateTime } from "@/shared/utils/format-time";
import { useSpotBalances } from "@/features/spot/hooks/remote/useExchange";
import type { IWallet } from "@/features/spot/types";
import { TableCore, type ColumnDef } from "../table/table-core";
import { useFuturesBalance } from "@/features/futures/hooks/remote/useExchange";
import ClosePositionModal from "@/features/futures/components/close-position-modal";
import TpSlPositionModal from "@/features/futures/components/tpsl-position-modal";

interface Props {
  activeTab: string;
  marketType?: "SPOT" | "FUTURES";
}

const formatDate = (date: string | number) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const TradeHistoryBody = ({ activeTab, marketType = "SPOT" }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { invalidate } = useInvalidateQueries();

  const { mutate: cancelOrderApi } = useMutation({
    mutationFn: cancelOrder,
  });
  const [closePosition, setClosePosition] = useState<IPosition | null>(null);
  const [tpslPosition, setTpslPosition] = useState<IPosition | null>(null);
  useSocketBalanceUpdate();
  useSocketOrderUpdate();

  // Data hooks
  const { orders: openOrders, isLoading: openLoading } = useOpenOrders({
    limit: 50,
    status: "PENDING",
    symbol: id,
  });
  const { orders: historyOrders, isLoading: histLoading } = useOpenOrders({
    limit: 50,
    symbol: id,
  });
  // Conditionally fetch balances
  const { balances: spotBalances, isLoading: spotBalLoading } =
    useSpotBalances();
  const { balance: futuresBalance, isLoading: futBalLoading } =
    useFuturesBalance();

  const balances = marketType === "FUTURES" ? [] : spotBalances; // Adapting logic below
  const balLoading = marketType === "FUTURES" ? futBalLoading : spotBalLoading;

  const { positions, isLoading: posLoading } = usePositions();
  const { positions: historyPositions, isLoading: posHistoryLoading } =
    usePositionHistory({
      limit: 50,
      // symbol: id,
      page: 1,
    });
  const { trades, isLoading: tradesLoading } = useTrades({
    limit: 10,
    symbol: id,
  });
  const { transactions, isLoading: txLoading } = useTransactions({ limit: 50 });

  const { positionsRisk, accountRisk } =
    marketType === "FUTURES"
      ? useRiskData()
      : { positionsRisk: undefined, accountRisk: undefined };
  const mergedPositions = useMemo(() => {
    if (marketType === "SPOT" || !positions) return [];

    return positions.map((pos) => {
      const riskUpdate = positionsRisk?.[pos.id.toString()];
      if (riskUpdate) {
        return {
          ...pos,
          markPrice: riskUpdate.mp,
          liquidationPrice: riskUpdate.lp,
          marginRatio: riskUpdate.mr,
          unrealizedPnl: riskUpdate.up,
          maintenanceMargin: riskUpdate.mm,
          margin: riskUpdate.m,
        } as IPosition;
      }
      return pos;
    });
  }, [positions, positionsRisk, marketType]);

  // useEffect(() => {
  //   if (tpslPosition) {
  //     setTpslPosition((prev: IPosition | null) => {
  //       if (!prev) return null;
  //       return {
  //         ...prev,
  //         markPrice: positionsRisk?.[prev.id.toString()].mp
  //       };
  //     });
  //   }
  // }, [tpslPosition, positionsRisk]);

  const accountRiskData = useMemo(() => {
    if (!accountRisk || !futuresBalance) return undefined;
    if (accountRisk) {
      return {
        assetSymbol: accountRisk.a,
        balance: accountRisk.ab,
        frozenBalance: 0,
        totalMargin: accountRisk.mb,
        equity: accountRisk.e,
        unrealizedPL: accountRisk.up,
      };
    }
    return undefined;
  }, [futuresBalance, accountRisk]);

  let data: any[] = [];
  let cols: ColumnDef<any>[] = [];
  let loading = false;

  if (activeTab === "Open orders") {
    data = openOrders || [];
    loading = openLoading;
    cols = [
      {
        field: "createdAt" as keyof IOrder,
        headerName: "Time",
        render: (_val: any, row: IOrder) => (
          <span className="text-xs">{formatDate(row.createdAt || 0)}</span>
        ),
      },
      { field: "symbol" as keyof IOrder, headerName: "Symbol", sort: true },
      {
        field: "side" as keyof IOrder,
        headerName: "Side",
        sort: true,
        render: (_val: any, row: IOrder) => (
          <span
            className={row.side === "BUY" ? "text-green-500" : "text-red-500"}
          >
            {row.side}
          </span>
        ),
      },
      {
        field: "price" as keyof IOrder,
        headerName: "Price",
        render: (_val: any, row: IOrder) => fNumber(row.price || 0),
      },
      {
        field: "quantity" as keyof IOrder,
        headerName: "Amount",
        render: (_val: any, row: IOrder) => fNumber(row.quantity),
      },
      { field: "filledQty" as keyof IOrder, headerName: "Filled" },
      { field: "status", headerName: "Status" },
      {
        field: "orderId" as keyof IOrder,
        headerName: "Action",
        render: (_val: any, row: IOrder) => (
          <button
            className="text-red-500 hover:text-red-400 underline"
            onClick={() => {
              cancelOrderApi(
                { orderId: row.orderId },
                {
                  onSuccess: () => {
                    invalidate([
                      ["open-orders"],
                      ["portfolio-orders-history"],
                      ["portfolio-balances"],
                    ]);
                  },
                  onError: (err) => {
                    console.error("Failed to cancel order:", err);
                  },
                }
              );
            }}
          >
            Cancel
          </button>
        ),
      },
    ];
  } else if (activeTab === "Orders history") {
    data = historyOrders || [];
    loading = histLoading;
    cols = [
      {
        field: "createdAt" as keyof IOrder,
        headerName: "Time",
        render: (_val: any, row: IOrder) => (
          <span className="text-xs">{formatDate(row.createdAt || 0)}</span>
        ),
      },
      { field: "symbol" as keyof IOrder, headerName: "Symbol", sort: true },
      {
        field: "side" as keyof IOrder,
        headerName: "Side",
        sort: true,
        render: (_val: any, row: IOrder) => (
          <span
            className={row.side === "BUY" ? "text-green-500" : "text-red-500"}
          >
            {row.side}
          </span>
        ),
      },
      { field: "orderType" as keyof IOrder, headerName: "Type" },
      {
        field: "price" as keyof IOrder,
        headerName: "Price",
        render: (_val: any, row: IOrder) => fNumber(row.price || 0),
      },
      {
        field: "quantity" as keyof IOrder,
        headerName: "Amount",
        render: (_val: any, row: IOrder) => parseFloat(row.quantity),
      },
      {
        field: "filledQty" as keyof IOrder,
        headerName: "Filled",
        render: (_val: any, row: IOrder) => parseFloat(row.filledQty),
      },
      { field: "status", headerName: "Status" },
    ];
  } else if (activeTab === "Trade history") {
    data = trades?.rows || [];
    loading = tradesLoading;
    cols = [
      {
        field: "createdAt" as keyof ITradeHistory,
        headerName: "Time",
        render: (_val: any, row: ITradeHistory) => (
          <span className="text-xs">{formatDate(row.createdAt)}</span>
        ),
      },
      {
        field: "symbol" as keyof ITradeHistory,
        headerName: "Symbol",
        sort: true,
      },
      {
        field: "side" as keyof ITradeHistory,
        headerName: "Side",
        sort: true,
        render: (_val: any, row: ITradeHistory) => (
          <span
            className={row.side === "BUY" ? "text-green-500" : "text-red-500"}
          >
            {row.side}
          </span>
        ),
      },
      {
        field: "quantity" as keyof ITradeHistory,
        headerName: "Qty",
        render: (_val: any, row: ITradeHistory) => fNumber(row.quantity),
      },
      {
        field: "price" as keyof ITradeHistory,
        headerName: "Price",
        render: (_val: any, row: ITradeHistory) => fNumber(row.price),
      },
      {
        field: "quoteQuantity" as keyof ITradeHistory,
        headerName: "Quote Qty",
        render: (_val: any, row: ITradeHistory) => fNumber(row.quoteQuantity),
      },
      {
        field: "type" as keyof ITradeHistory,
        headerName: "Role",
        render: (_val: any, row: ITradeHistory) =>
          row.isMaker ? "Maker" : "Taker",
      },
      {
        field: "fee" as keyof ITradeHistory,
        headerName: "Fee",
        render: (_val: any, row: ITradeHistory) =>
          fNumber(row.fee, 8) + " " + row.feeAsset,
      },
    ];
  } else if (activeTab === "Transaction history") {
    data = transactions || [];
    loading = txLoading;
    cols = [
      {
        field: "createdAt",
        headerName: "Time",
        render: (_val: any) => (
          <span className="text-xs">{formatDate(_val)}</span>
        ),
      },
      { field: "type", headerName: "Type" },
      { field: "assetSymbol", headerName: "Asset" },
      {
        field: "amount",
        headerName: "Amount",
        render: (_val: any) => fNumber(_val),
      },
      { field: "status", headerName: "Status" },
    ];
  } else if (activeTab === "Assets") {
    if (marketType === "FUTURES") {
      data = accountRiskData
        ? [
            {
              assetSymbol: accountRiskData.assetSymbol,
              balance: accountRiskData.balance,
              frozenBalance: accountRiskData.frozenBalance,
              totalMargin: accountRiskData.totalMargin,
              equity: accountRiskData.equity,
              unrealizedPL: accountRiskData.unrealizedPL,
            },
          ]
        : [];
      loading = balLoading;
      cols = [
        { field: "assetSymbol", headerName: "Asset", sort: true },
        {
          field: "equity",
          headerName: "Equity",
          render: (_val: any, row: any) => fNumber(row.equity),
        },
        {
          field: "balance",
          headerName: "Wallet Balance",
          render: (_val: any, row: any) => fNumber(row.balance),
        },
        {
          field: "totalMargin",
          headerName: "Margin Balance",
          render: (_val: any, row: any) => fNumber(row.totalMargin),
        },
        {
          field: "unrealizedPL",
          headerName: "Unrealized PNL",
          render: (_val: any, row: any) => (
            <span
              className={
                Number(row.unrealizedPL) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {fNumber(row.unrealizedPL)}
            </span>
          ),
        },
      ];
    } else {
      data = balances || [];
      loading = balLoading;
      cols = [
        {
          field: "assetSymbol" as keyof IWallet,
          headerName: "Asset",
          sort: true,
        },
        {
          field: "balance" as keyof IWallet,
          headerName: "Total Balance",
          render: (_val: any, row: IWallet) => fNumber(row.balance),
        },
        {
          field: "frozenBalance" as keyof IWallet,
          headerName: "Frozen",
          render: (_val: any, row: IWallet) => fNumber(row.frozenBalance),
        },
      ];
    }
  } else if (activeTab === "Positions") {
    data = mergedPositions || [];
    loading = posLoading;
    cols = [
      { field: "symbol" as keyof IPosition, headerName: "Symbol" },
      {
        field: "side" as keyof IPosition,
        headerName: "Side",
        render: (_val: any, row: IPosition) => (
          <span
            className={row.side === "LONG" ? "text-green-500" : "text-red-500"}
          >
            {row.side} x{row.leverage}{" "}
          </span>
        ),
      },
      {
        field: "size" as keyof IPosition,
        headerName: "Size",
        render: (_val: any, row: IPosition) => fNumber(row.size),
      },
      {
        field: "entryPrice" as keyof IPosition,
        headerName: "Entry Price",
        render: (_val: any, row: IPosition) => fNumber(row.entryPrice),
      },
      {
        field: "markPrice" as keyof IPosition,
        headerName: "Mark Price",
        render: (_val: any, row: IPosition) => fNumber(row.markPrice),
      },
      {
        field: "unrealizedPnl" as keyof IPosition,
        headerName: "PNL",
        render: (_val: any, row: IPosition) => (
          <span
            className={
              Number(row.unrealizedPnl) >= 0 ? "text-green-500" : "text-red-500"
            }
          >
            {fNumber(row.unrealizedPnl)}
          </span>
        ),
      },
      {
        field: "marginRatio" as keyof IPosition,
        headerName: "Margin Ratio",
        render: (_val: any, row: IPosition) => fNumber(row.marginRatio),
      },
      {
        field: "maintenanceMargin" as keyof IPosition,
        headerName: "MM",
        render: (_val: any, row: IPosition) => fNumber(row.maintenanceMargin),
      },
      {
        field: "margin" as keyof IPosition,
        headerName: "Margin",
        render: (_val: any, row: IPosition) => fNumber(row.margin),
      },
      {
        field: "takeProfit" as keyof IPosition,
        headerName: "TP/SL",
        render: (_val: any, row: IPosition) => (
          <span className="text-xs">
            {row.takeProfit ? fNumber(row.takeProfit) : "-"} /{" "}
            {row.stopLoss ? fNumber(row.stopLoss) : "-"}
          </span>
        ),
      },
      {
        field: "liquidationPrice" as keyof IPosition,
        headerName: "Liq. Price",
        render: (_val: any, row: IPosition) =>
          fNumber(row.liquidationPrice) === "0.00"
            ? "-"
            : fNumber(row.liquidationPrice),
      },
      {
        field: "id" as keyof IPosition,
        headerName: "Action",
        render: (_val: any, row: IPosition) => (
          <div className="flex gap-3">
            <button
              className="text-brand-500 hover:text-brand-400 underline text-sm whitespace-nowrap"
              onClick={() => setTpslPosition(row)}
            >
              TP/SL
            </button>
            <button
              className="text-red-500 hover:text-red-400 underline text-sm whitespace-nowrap"
              onClick={() => setClosePosition(row)}
            >
              Close
            </button>
          </div>
        ),
      },
    ];
  } else if (activeTab === "Positions history") {
    data = historyPositions || [];
    loading = posHistoryLoading;
    cols = [
      { field: "symbol" as keyof IPosition, headerName: "Symbol" },
      {
        field: "side" as keyof IPosition,
        headerName: "Side",
        render: (_val: any, row: IPosition) => (
          <span
            className={row.side === "LONG" ? "text-green-500" : "text-red-500"}
          >
            {row.side}
          </span>
        ),
      },
      {
        field: "size" as keyof IPosition,
        headerName: "Size",
        render: (_val: any, row: IPosition) => fNumber(row.size),
      },
      {
        field: "entryPrice" as keyof IPosition,
        headerName: "Entry Price",
        render: (_val: any, row: IPosition) => fNumber(row.entryPrice),
      },
      {
        field: "exitPrice" as keyof IPosition,
        headerName: "Exit Price",
        render: (_val: any, row: IPosition) => fNumber(row.exitPrice),
      },
      {
        field: "realizedPnl" as keyof IPosition,
        headerName: "PNL",
        render: (_val: any, row: IPosition) => (
          <span
            className={
              Number(row.realizedPnl) >= 0 ? "text-green-500" : "text-red-500"
            }
          >
            {fNumber(row.realizedPnl) + " (" + row.roe + "%)"}
          </span>
        ),
      },
      {
        field: "totalFees" as keyof IPosition,
        headerName: "Fees",
        render: (_val: any, row: IPosition) => fNumber(row.totalFees),
      },
      {
        field: "status" as keyof IPosition,
        headerName: "Status",
        render: (_val: any, row: IPosition) => row.status,
      },
      {
        field: "closedAt" as keyof IPosition,
        headerName: "Closed At",
        render: (_val: any, row: IPosition) => fDateTime(row.closedAt),
      },
    ];
  } else if (activeTab === "Deposits & withdrawals") {
    // Re-use transaction hook or separate? Usually similar endpoints
    data = []; // Not implemented specifically
    loading = false;
    cols = [
      { field: "type", headerName: "Type" },
      { field: "amount", headerName: "Amount" },
    ];
  }

  return (
    <>
      <div className="min-h-[200px]">
        <TableCore rowData={data} columnDefs={cols} loading={loading} />
      </div>
      {marketType === "FUTURES" && (
        <>
          <ClosePositionModal
            open={!!closePosition}
            onClose={() => setClosePosition(null)}
            position={closePosition}
          />
          <TpSlPositionModal
            open={!!tpslPosition}
            onClose={() => setTpslPosition(null)}
            position={tpslPosition}
          />
        </>
      )}
    </>
  );
};

export default TradeHistoryBody;
