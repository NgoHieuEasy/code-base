/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IChartingLibraryWidget } from "public/static/charting_library/charting_library";

import { useLocalStorage } from "@/zustand/useLocalStorage";
import { useChartStore } from "@/zustand/useChartStore";
import { useMutation } from "@tanstack/react-query";
import {
  cancelOrder,
  closePosition,
  setPositionTpSl,
} from "../remote/useExchange";
import { useInvalidateQueries } from "./useRefreshData";
const formatSymbol = (symbol: string, _isPerp: boolean) => {
  return symbol;
};

export const useOrderLines = (
  symbol: string,
  positions: any[],
  orders: any[]
) => {
  const { invalidate } = useInvalidateQueries();
  // console.log(orders);
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
  const [chartLines, setChartLines] = useState<{ [key: string]: any }>({});

  const prevPositionsRef = useRef<any[]>([]);
  const prevPendingPriceRef = useRef("");
  const prevPendingRef = useRef("");
  const prevTimeframe = useRef("");
  const prevShowChartOrder = useRef("");

  const [doNotShowAgain] = useLocalStorage("SHOW_CONFIRM_EDIT", false);
  const [showChartOrders] = useLocalStorage("SHOW_CHART_ORDERS", false);
  const { timeframe, chartLoaded, isChartReady, setEditOrderData } =
    useChartStore();

  const currentAsset = {
    quote_tick: 0.01,
  };

  const refreshAlgo = () => {
    console.log("Refreshing algo");
  };

  const { mutate: closePositionApi } = useMutation({
    mutationFn: closePosition,
  });
  const { mutate: cancelOrderApi } = useMutation({
    mutationFn: cancelOrder,
  });
  const { mutate: setPositionTpSlApi } = useMutation({
    mutationFn: setPositionTpSl,
  });

  const handleClosePosition = async (position: any) => {
    closePositionApi(
      { positionId: position.id },
      {
        onSuccess: () => {
          invalidate([
            ["open-orders"],
            ["portfolio-orders-history"],
            ["portfolio-balances"],
          ]);
        },
        onError: (err) => {
          console.error("Failed to close position:", err);
        },
      }
    );
  };

  const closePendingOrder = async (orderId: string) => {
    cancelOrderApi(
      { orderId },
      {
        onSuccess: () => {
          invalidate([
            ["open-orders"],
            ["portfolio-orders-history"],
            ["portfolio-balances"],
          ]);

          refreshAlgo();
        },
        onError: (err) => {
          console.error("Failed to cancel order:", err);
        },
      }
    );
  };

  const closeTPSL = async (positionId: number, type: "TP" | "SL") => {
    try {
      const dto: any = { positionId };
      if (type === "TP") dto.takeProfitPrice = 0; // Or null depending on backend API for clearing
      if (type === "SL") dto.stopLossPrice = 0;
      setPositionTpSlApi(dto, {
        onSuccess: () => {
          refreshAlgo();
        },
      });
    } catch (error) {
      console.error("Failed to clear TP/SL:", error);
    }
  };

  const editAlgoOrder = async (
    data: any,
    positionId: number,
    cb?: () => void
  ) => {
    try {
      const dto: any = { positionId: Number(positionId) };
      if (data.takeProfit)
        dto.takeProfitPrice = Number(data.takeProfit.trigger_price);
      if (data.stopLoss)
        dto.stopLossPrice = Number(data.stopLoss.trigger_price);

      setPositionTpSlApi(dto, {
        onSuccess: () => {
          invalidate([["open-orders"], ["portfolio-positions"]]);
        },
        onError: (err) => {
          console.error("Failed to edit position:", err);
        },
      });
      if (cb) cb();
      refreshAlgo();
    } catch (error) {
      console.error("Failed to edit TP/SL:", error);
      if (cb) cb();
    }
  };

  function formatPriceByTick(price: number): string {
    const tickSize = currentAsset?.quote_tick;
    if (!price && price !== 0) return "0";
    if (!tickSize || tickSize <= 0) return price.toString();

    try {
      const tickString = tickSize.toExponential();
      const precision = Math.abs(
        parseInt(tickString.split("e")[1]) ||
          tickString.split(".")[1]?.length ||
          0
      );

      const multiplier = Math.pow(10, precision);
      const scaledPrice = Math.round(price * multiplier);
      const scaledTick = Math.round(tickSize * multiplier);

      const roundedScaledPrice =
        Math.round(scaledPrice / scaledTick) * scaledTick;
      const roundedPrice = roundedScaledPrice / multiplier;
      return roundedPrice.toFixed(precision);
    } catch (error) {
      return price.toString();
    }
  }

  // const { data: allOrders } = usePrivateQuery<any[]>("/v1/trades?size=500");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePositions = useCallback(() => {
    console.log(
      "Updating positions...Updating positions...Updating positions..."
    );
    if (!tvWidget || !positions) {
      console.warn(
        "Chart or relevant positions not available. Skipping update."
      );
      return;
    }

    try {
      const currentTPSLOrders =
        positions?.filter(
          (position: any) => position?.takeProfit || position?.stopLoss
        ) || [];
      const currentPendingOrders =
        (isArray(orders) ? orders : (orders as any)?.rows)?.filter(
          (entry: any) => entry?.order_id || entry?.orderId || entry?.id
        ) || [];
      const newPrices =
        currentPendingOrders?.map((entry: any) => Number(entry.price)) || [];
      const prevPrices = (prevPendingPriceRef as any).current || [];

      const currentValidOrderIds = new Set<string>();

      if (showChartOrders?.position)
        positions?.forEach((position: any) => {
          if (position.symbol === symbol && position?.id) {
            const orderId = new Date(position?.createdAt).getTime();
            currentValidOrderIds.add(`open_${orderId}`);
            currentValidOrderIds.add(`static_open_${orderId}`);
            currentValidOrderIds.add(`liq_${orderId}`);
          }
        });

      if (showChartOrders?.tpSl)
        positions?.forEach((position: any) => {
          if (position.symbol === symbol && position?.id) {
            const baseOrderId = position.id;
            if (position.takeProfit) {
              currentValidOrderIds.add(
                `tp_${baseOrderId}_${position.takeProfit}`
              );
            }
            if (position.stopLoss) {
              currentValidOrderIds.add(
                `sl_${baseOrderId}_${position.stopLoss}`
              );
            }
          }
        });

      if (showChartOrders?.limitOrder)
        currentPendingOrders.forEach((order: any) => {
          if (order.symbol === symbol) {
            currentValidOrderIds.add(`${order.orderId || order.id}`);
          }
        });

      const hasPositionsChanged = () => {
        if (positions?.length !== (prevPositionsRef.current?.length || 0)) {
          return true;
        }

        return positions?.some((position, index) => {
          const prevPosition = prevPositionsRef.current?.[index];

          return (
            !prevPosition ||
            position.size !== (prevPosition as any).size ||
            position.entryPrice !== (prevPosition as any).entryPrice ||
            position.takeProfit !== (prevPosition as any).takeProfit ||
            position.stopLoss !== (prevPosition as any).stopLoss
          );
        });
      };
      const positionHadChanged = hasPositionsChanged();

      const hasChanges =
        newPrices.length !== prevPrices.length ||
        newPrices.some(
          (price: number, index: number) => price !== prevPrices[index]
        ) ||
        currentPendingOrders?.length !== Number(prevPendingRef.current) ||
        prevTimeframe.current !== timeframe ||
        positionHadChanged ||
        prevShowChartOrder.current !== JSON.stringify(showChartOrders);

      if (hasChanges) {
        Object.entries(chartLines).forEach(([lineId, line]) => {
          if (!currentValidOrderIds.has(lineId)) {
            if (line && typeof line.remove === "function") {
              line.remove();
              delete chartLines[lineId];
            }
          }
        });

        const newChartLines: { [key: string]: any } = { ...chartLines };
        const processedOrderIds = new Set<string>();

        if (showChartOrders?.position)
          positions?.forEach((position: any) => {
            if (position.symbol !== symbol || !position?.entryPrice) return;

            const orderId = new Date(position?.createdAt).getTime();

            if (!orderId || processedOrderIds.has(orderId.toString())) return;
            const openPriceLineId = `open_${orderId}`;

            if (newChartLines[openPriceLineId]) {
              newChartLines[openPriceLineId].remove();
              delete newChartLines[openPriceLineId];
            }

            const staticOpenLineId = `static_open_${orderId}`;
            if (newChartLines[staticOpenLineId]) {
              newChartLines[staticOpenLineId].remove();
              delete newChartLines[staticOpenLineId];
            }

            const staticOpenLine = tvWidget
              ?.activeChart()
              ?.createOrderLine()
              .setText(position.side)
              .setBodyFont("Poppins")
              .setTooltip("Position Entry")
              .setCancelTooltip("Close Position")
              .setPrice(Number(position?.entryPrice))
              .onCancel(async function () {
                await handleClosePosition(position);
              })
              .setQuantity(
                `${Math.abs(position?.size)} ${formatSymbol(
                  position?.symbol,
                  true
                )}`
              )
              .setBodyTextColor("#FFF")
              .setBodyBackgroundColor("#836EF9")
              .setBodyBorderColor("#ac9efb")
              .setLineColor("#836EF9")
              .setQuantityBackgroundColor("#2b2f36")
              .setQuantityBorderColor("#836EF9")
              .setCancelButtonBackgroundColor("#2b2f36")
              .setCancelButtonBorderColor("#836EF9")
              .setCancelButtonIconColor("#FFF")
              .setLineStyle(0);

            const openPriceLine = tvWidget
              ?.activeChart()
              ?.createOrderLine()
              // .setText("Drag to set TP/SL")
              .setBodyFont("Poppins")
              .setPrice(Number(position?.entryPrice))
              .onMove(function () {
                const newPrice = Number(
                  formatPriceByTick(openPriceLine.getPrice())
                );
                const entryPrice = Number(position.entryPrice);
                if (newPrice === entryPrice) return;

                let type: "TP" | "SL";
                if (position.side === "LONG") {
                  type = newPrice > entryPrice ? "TP" : "SL";
                } else {
                  type = newPrice < entryPrice ? "TP" : "SL";
                }

                // openPriceLine.setText(`Set ${type}`);

                const actualParams: any = {
                  takeProfit:
                    type === "TP"
                      ? { trigger_price: newPrice, quantity: position.size }
                      : position.takeProfit
                      ? {
                          trigger_price: Number(position.takeProfit),
                          quantity: position.size,
                        }
                      : undefined,
                  stopLoss:
                    type === "SL"
                      ? { trigger_price: newPrice, quantity: position.size }
                      : position.stopLoss
                      ? {
                          trigger_price: Number(position.stopLoss),
                          quantity: position.size,
                        }
                      : undefined,
                };

                const resetPrice = () => {
                  try {
                    openPriceLine.setPrice(entryPrice);
                    // openPriceLine.setText("Drag to set TP/SL");
                  } catch (e) {
                    console.log(e);
                  }
                };

                if (doNotShowAgain) {
                  editAlgoOrder(actualParams, position.id, resetPrice);
                } else {
                  setEditOrderData({
                    open: true,
                    order: {
                      price: newPrice,
                      qty: position.size,
                      symbol: position.symbol,
                      type: type,
                    },
                    callback: () => {
                      editAlgoOrder(actualParams, position.id, resetPrice);
                    },
                    onCancel: resetPrice,
                  });
                }
              })
              .setQuantity("")
              .setBodyTextColor("#FFF")
              .setBodyBackgroundColor("rgba(131, 110, 249, 0.5)")
              .setBodyBorderColor("#ac9efb")
              .setLineColor("rgba(131, 110, 249, 0.5)")
              .setLineStyle(2);

            if (staticOpenLine) {
              newChartLines[staticOpenLineId] = staticOpenLine;
              processedOrderIds.add(orderId.toString());
            }

            if (openPriceLine) {
              newChartLines[openPriceLineId] = openPriceLine;
            }
            // const liqPriceLine = tvWidget
            //   ?.activeChart()
            //   ?.createOrderLine()
            //   .setText("Liquidation price")
            //   .setPrice(position?.est_liq_price as number | 0)
            //   .setBodyTextColor("#FFF")
            //   .setBodyBackgroundColor("#836EF9")
            //   .setBodyBorderColor("#ac9efb")
            //   .setLineColor("#836EF9")
            //   .setQuantityBackgroundColor("#2b2f36")
            //   .setQuantityBorderColor("#836EF9")
            //   .setCancelButtonBackgroundColor("#2b2f36")
            //   .setCancelButtonBorderColor("#836EF9")
            //   .setCancelButtonIconColor("#FFF")
            //   .setLineStyle(0);

            if (openPriceLine) {
              newChartLines[openPriceLineId] = openPriceLine;
              // newChartLines[openPriceLineId] = liqPriceLine;
              processedOrderIds.add(orderId.toString());
            }
          });

        if (showChartOrders?.tpSl)
          currentTPSLOrders.forEach((position: any) => {
            if (position.symbol !== symbol) return;

            const baseOrderId = position?.id;

            if (position.takeProfit) {
              const tpLineId = `tp_${baseOrderId}_${position.takeProfit}`;

              if (newChartLines[tpLineId]) {
                newChartLines[tpLineId].remove();
                delete newChartLines[tpLineId];
              }

              const order = tvWidget
                ?.activeChart()
                ?.createOrderLine()
                // .setTooltip("Additional order information")
                .setCancelTooltip("Cancel TP")
                .setPrice(position.takeProfit)
                .onMove(function () {
                  const price = Number(formatPriceByTick(order.getPrice()));
                  const actualPrice = position.takeProfit;
                  if (doNotShowAgain) {
                    editAlgoOrder(
                      {
                        takeProfit: {
                          trigger_price: price,
                          quantity: position.size,
                        },
                        stopLoss: {
                          trigger_price: position.stopLoss || undefined,
                          quantity: position.size,
                        },
                      },
                      position.id
                    );
                  } else
                    setEditOrderData({
                      open: true,
                      callback: () => {
                        editAlgoOrder(
                          {
                            takeProfit: {
                              trigger_price: price,
                              quantity: position.size,
                            },
                            stopLoss: {
                              trigger_price: position.stopLoss || undefined,
                              quantity: position.size,
                            },
                          },
                          position.id,
                          () => {
                            try {
                              if (order) order.setPrice(actualPrice);
                              setEditOrderData((prev) => ({
                                ...prev,
                                open: false,
                              }));
                            } catch (e) {
                              setEditOrderData((prev) => ({
                                ...prev,
                                open: false,
                              }));
                            }
                          }
                        );
                      },
                      order: {
                        price,
                        qty: position.size,
                        symbol: position.symbol,
                        type: "TP",
                      },
                      onCancel: () => {
                        try {
                          if (order) order.setPrice(actualPrice);
                          setEditOrderData((prev) => ({
                            ...prev,
                            open: false,
                          }));
                          refreshAlgo();
                        } catch (e) {
                          setEditOrderData((prev: any) => ({
                            ...prev,
                            open: false,
                          }));
                        }
                      },
                    });
                })
                .onCancel(async function () {
                  await closeTPSL(position.id, "TP");
                })
                .setQuantity(
                  `${position.size.toString()} ${formatSymbol(
                    position.symbol,
                    true
                  )}`
                )
                .setBodyTextColor("#FFF")
                .setBodyBackgroundColor("#0fa96d")
                .setBodyBorderColor("#22e598")
                .setLineColor("#22e598")
                .setQuantityBackgroundColor("#2b2f36")
                .setQuantityBorderColor("#0fa96d")
                .setCancelButtonBackgroundColor("#2b2f36")
                .setCancelButtonBorderColor("#0fa96d")
                .setCancelButtonIconColor("#FFF")
                .setLineStyle(1)
                .setText(`TAKE PROFIT`);
              if (order) {
                newChartLines[tpLineId] = order;
              }
            }

            if (position.stopLoss) {
              const slLineId = `sl_${baseOrderId}_${position.stopLoss}`;

              if (newChartLines[slLineId]) {
                newChartLines[slLineId].remove();
                delete newChartLines[slLineId];
              }

              const order = tvWidget
                ?.activeChart()
                ?.createOrderLine()
                .setCancelTooltip("Cancel SL")
                .setPrice(position.stopLoss)
                .onMove(function () {
                  try {
                    const price = Number(formatPriceByTick(order.getPrice()));
                    const actualPrice = position.stopLoss;
                    console.log("doNotShowAgain", doNotShowAgain);
                    if (doNotShowAgain) {
                      editAlgoOrder(
                        {
                          stopLoss: {
                            trigger_price: price,
                            quantity: position.size,
                          },
                          takeProfit: {
                            trigger_price: position.takeProfit || undefined,
                            quantity: position.size,
                          },
                        },
                        position.id
                      );
                    } else
                      setEditOrderData({
                        open: true,
                        callback: () => {
                          editAlgoOrder(
                            {
                              stopLoss: {
                                trigger_price: price,
                                quantity: position.size,
                              },
                              takeProfit: {
                                trigger_price: position.takeProfit || undefined,
                                quantity: position.size,
                              },
                            },
                            position.id,
                            () => {
                              try {
                                if (order) order.setPrice(actualPrice);
                                setEditOrderData((prev) => ({
                                  ...prev,
                                  open: false,
                                }));
                              } catch (e) {
                                setEditOrderData((prev) => ({
                                  ...prev,
                                  open: false,
                                }));
                              }
                            }
                          );
                        },
                        order: {
                          price,
                          qty: position.size,
                          symbol: position.symbol,
                          type: "SL",
                        },
                        onCancel: () => {
                          try {
                            if (order) order.setPrice(actualPrice);
                            setEditOrderData((prev) => ({
                              ...prev,
                              open: false,
                            }));
                          } catch (e) {
                            setEditOrderData((prev) => ({
                              ...prev,
                              open: false,
                            }));
                          }
                        },
                      });
                  } catch (error) {
                    console.error("Error editing TP/SL:", error);
                  }
                })
                .onCancel(async function () {
                  await closeTPSL(position.id, "SL");
                })
                .setQuantity(
                  `${position.size.toString()} ${formatSymbol(
                    position.symbol,
                    true
                  )}`
                )
                .setBodyTextColor("#FFF")
                .setBodyBackgroundColor("#ba3230")
                .setBodyBorderColor("#f03f3d")
                .setLineColor("#f03f3d")
                .setQuantityBackgroundColor("#2b2f36")
                .setQuantityBorderColor("#ba3230")
                .setCancelButtonBackgroundColor("#2b2f36")
                .setCancelButtonBorderColor("#ba3230")
                .setCancelButtonIconColor("#FFF")
                .setLineStyle(1)
                .setText(`STOP LOSS`);

              if (order) {
                newChartLines[slLineId] = order;
              }
            }
          });

        if (showChartOrders?.limitOrder) {
          currentPendingOrders.forEach((order: any) => {
            if (order.symbol !== symbol) return;

            const pendingLineId = `${order.orderId || order.id}`;

            if (newChartLines[pendingLineId]) {
              newChartLines[pendingLineId].remove();
              delete newChartLines[pendingLineId];
            }

            const isBuy = order.side === "BUY";

            const pendingLine = tvWidget
              ?.activeChart()
              ?.createOrderLine()
              .setTooltip("Additional order information")
              .setCancelTooltip("Cancel order")
              .setPrice(Number(order.price))
              // .onMove(function () {
              //   const price = Number(pendingLine.getPrice().toFixed(2));
              //   console.log(price);
              //   // editPendingOrder({
              //   //   order_id: order.order_id,
              //   //   order_price: price,
              //   //   side: order.side,
              //   //   order_type: order.type,
              //   //   symbol: order.symbol,
              //   // });
              // })
              .onCancel(async function () {
                closePendingOrder(order.orderId || order.id);
              })
              .setQuantity(
                `${order.quantity.toString()} ${formatSymbol(
                  order.symbol,
                  true
                )}`
              )
              .setBodyTextColor("#FFF")
              .setBodyBackgroundColor(isBuy ? "#0fa96d" : "#ba3230")
              .setBodyBorderColor(isBuy ? "#22e598" : "#f03f3d")
              .setLineColor(isBuy ? "#22e598" : "#f03f3d")
              .setQuantityBackgroundColor("#2b2f36")
              .setQuantityBorderColor(isBuy ? "#0fa96d" : "#ba3230")
              .setCancelButtonBackgroundColor("#2b2f36")
              .setCancelButtonBorderColor(isBuy ? "#0fa96d" : "#ba3230")
              .setCancelButtonIconColor("#FFF")
              .setLineStyle(1)
              .setText(`${order.side} LIMIT`);

            if (pendingLine) {
              newChartLines[pendingLineId] = pendingLine;
            }
          });
        }

        tvWidget.chart().createShape(
          { price: 111000, time: 1761801910 },
          {
            shape: "horizontal_line",
            text: `⚠️ Liquidation: $`,
            overrides: {
              linecolor: "#F59E0B", // Laranja
              linestyle: 1, // Linha pontilhada
              linewidth: 1,
              showLabel: true,
              textcolor: "#F59E0B",
              fontsize: 11,
              horzLabelsAlign: "left",
            },
          }
        );

        setChartLines(newChartLines);
        (prevPositionsRef as any).current = positions;
        (prevPendingPriceRef as any).current = newPrices;
        (prevPendingRef as any).current = currentPendingOrders?.length;
        prevTimeframe.current = timeframe;
        prevShowChartOrder.current = JSON.stringify(showChartOrders);
        chartLoaded();
      }
    } catch (error) {
      console.error("Error updating positions:", error);
    }
  }, [
    symbol,
    positions,
    showChartOrders,
    orders,
    timeframe,
    tvWidget,
    handleClosePosition,
    closeTPSL,
    editAlgoOrder,
    doNotShowAgain,
    setEditOrderData,
  ]);

  useEffect(() => {
    if (!tvWidget || !isChartReady) return;

    const timeoutId = setTimeout(() => {
      updatePositions();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [
    positions,
    timeframe,
    orders,
    showChartOrders,
    tvWidget,
    isChartReady,
    updatePositions,
  ]);

  useEffect(() => {
    return () => {
      Object.values(chartLines).forEach((line: any) => {
        if (line && typeof line.remove === "function") {
          line.remove();
        }
      });
    };
  }, []);

  return { tvWidget, setTvWidget, updatePositions };
};
