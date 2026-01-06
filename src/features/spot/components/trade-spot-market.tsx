import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useExchangeStore } from "@/zustand/useExchangeStore";
import { useSocketTicker } from "@/shared/hooks/socket/useTicker";
import { createOrder, useSpotBalances } from "../hooks/remote/useExchange";
import { useMutation } from "@tanstack/react-query";
import { cutByStepSize, fNumber } from "@/shared/utils/format-number";
import type { OrderSide } from "../types";
import { useInvalidateQueries } from "@/shared/hooks/local/useRefreshData";
import { Field, Form } from "@/shared/components/hook-form";
import Select from "@/shared/components/form/select";
import PercentSlider from "@/shared/components/slider/percent-slider";
import PrimaryButton from "@/shared/components/button/primary-button";

interface Props {
  orderType: string;
}

const TradeSpotMarket = ({ orderType }: Props) => {
  const { invalidate } = useInvalidateQueries();
  const { exInfo, currentPrice: storePrice } = useExchangeStore();
  const ticker = useSocketTicker(exInfo?.symbol || "");
  const currentPrice = Number(ticker?.p) || storePrice; // Prioritize live socket price

  const baseAsset = exInfo?.baseAssetSymbol || "BTC";
  const quoteAsset = exInfo?.quoteAssetSymbol || "USDT";
  const [option, setOptions] = useState("USDT"); // USDT (Quote) or Base Asset

  const defaultValues = {
    amount: "",
  };
  const schema = zod.object({
    amount: zod.string().min(1, "Amount is required"),
  });
  type SchemaType = zod.infer<typeof schema>;
  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { reset, setValue } = methods;

  const { mutate: createOrderApi, isPending } = useMutation({
    mutationFn: createOrder,
  });

  const { balances } = useSpotBalances();

  // If Buying:
  // - spending USDT (option=USDT): check Quote Balance
  // - buying BTC (option=BTC): check Quote Balance (cost estimated) ? No, usually we check balance of what we SPEND.
  //   - If option=BTC (Base), we are buying Amount BTC. Cost = Amount * Price. Need Quote Balance.

  // If Selling:
  // - selling BTC (option=BTC): check Base Balance.
  // - selling for USDT (option=USDT): check Base Balance (estimated).

  // Simplified:
  // Buy -> Spend Quote (USDT). Check USDT balance.
  // Sell -> Spend Base (BTC). Check BTC balance.
  const assetToSpend = orderType === "BUY" ? quoteAsset : baseAsset;

  const availableBalance =
    balances?.find((b) => b.assetSymbol === assetToSpend)?.balance || 0;

  const handlePercentChange = (percent: number) => {
    // Market order: just set amount as % of available balance (Spendable asset)
    // If user selected option=Quote and Order=Buy -> spending Quote.
    // If user selected option=Base and Order=Buy -> Spending Quote to get Base.
    //    (Cost = Base * Price). Max Base = QuoteBalance / Price.

    let maxAmount = 0;
    const price = currentPrice || 1;

    const bal = Number(availableBalance);

    if (orderType === "BUY") {
      if (option === quoteAsset) {
        // Spend USDT. Max = Balance USDT
        maxAmount = (bal * percent) / 100;
      } else {
        // Spend USDT to get Base. Max Base = Balance USDT / Price
        maxAmount = (bal * percent) / 100 / price;
      }
    } else {
      // SELL
      // Spend Base (BTC)
      if (option === baseAsset) {
        maxAmount = (bal * percent) / 100;
      } else {
        // Sell BTC to get USDT. Max USDT = Balance BTC * Price
        maxAmount = ((bal * percent) / 100) * price;
      }
    }

    // Precision handling?
    setValue("amount", maxAmount.toFixed(6)); // Simplified precision
  };

  const onTrade = async (data: SchemaType) => {
    if (!exInfo) return;

    // For Market Order, currently backend CreateOrderDto takes 'quantity'.
    // If option is USDT (Quote), and we are buying, we might need 'quoteOrderQty' API support or convert to Base.
    // Assuming 'quantity' in API is ALWAYS Base Quantity for now.
    // If user enters USDT, we divide by current price.

    let quantity = data.amount;
    const price = currentPrice || 1; // avoid div by zero

    if (orderType === "BUY" && option === quoteAsset) {
      // User specified USDT amount to spend. Convert to Base qty.
      // This is an estimation. Real matching engine might differ.
      const rawQty = Number(data.amount) / price;
      if (exInfo.stepSize) {
        quantity = cutByStepSize(rawQty, exInfo.stepSize).toString();
      } else {
        quantity = rawQty.toFixed(exInfo.qtyPrecision || 6);
      }
    }

    // If selling, option should ideally be Base. If they select Quote, it's weird for Market Sell (Sell enough BTC to get X USDT?).
    // Usually Market Sell is "Sell X BTC".
    // If option is USDT for Sell, convert to Base quantity: "Sell enough BTC to get X USDT".
    if (orderType === "SELL" && option === quoteAsset) {
      const rawQty = Number(data.amount) / price;
      if (exInfo.stepSize) {
        quantity = cutByStepSize(rawQty, exInfo.stepSize).toString();
      } else {
        quantity = rawQty.toFixed(exInfo.qtyPrecision || 6);
      }
    }

    createOrderApi(
      {
        symbol: exInfo.symbol,
        side: orderType as OrderSide,
        type: "SPOT",
        orderType: "MARKET",
        quantity,
        timeInForce: "IOC",
      },
      {
        onSuccess: () => {
          invalidate([
            ["open-orders"],
            ["portfolio-orders-history"],
            ["portfolio-balances"],
          ]);
          reset();
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-smRegular text-gray-500">
          Available to Trade:
        </span>
        <span className="text-smRegular text-gray-200">
          {fNumber(availableBalance)} {assetToSpend}
        </span>
        <button
          className="w-4 h-4 p-[2px]  border-brand-500 border-2 rounded-full flex items-center justify-center"
          onClick={() => setValue("amount", availableBalance.toString())} // Click plus to fill max
        >
          <Plus className="text-brand-500 font-bold" />
        </button>
      </div>
      <div>
        <Form methods={methods} onSubmit={methods.handleSubmit(onTrade)}>
          <div className="flex flex-col gap-3 mt-4">
            <Field.Text
              name=""
              placeholder={
                currentPrice ? fNumber(currentPrice) : "Market price"
              }
              disabled
              className="hover:cursor-not-allowed"
            />
            <Field.Text
              name="amount"
              InputProps={{
                endAdornment: (
                  <div>
                    <Select
                      value={option}
                      options={[
                        { label: quoteAsset, value: quoteAsset },
                        { label: baseAsset, value: baseAsset },
                      ]}
                      onChange={(v) => setOptions(String(v))}
                      className="border-none bg-transparent"
                    />
                  </div>
                ),
                // endTitle: symbolBase,
              }}
              placeholder={"Amount"}
            />
            <div className="px-7">
              <PercentSlider value={0} onChange={handlePercentChange} />
            </div>
            <PrimaryButton
              className={`${
                orderType === "BUY" ? "bg-green-600" : "bg-red-600"
              } mt-5`}
              text={
                isPending
                  ? "Submitting..."
                  : orderType === "BUY"
                  ? "Buy"
                  : "Sell"
              }
              type="submit"
            />

            <div className="flex gap-1 mt-2 justify-between">
              <span className="text-smRegular text-gray-500">Max:</span>
              <span className="text-smRegular text-gray-200">
                {fNumber(availableBalance)} {assetToSpend}
              </span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TradeSpotMarket;
