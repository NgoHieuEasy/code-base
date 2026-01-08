import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useEffect, useRef } from "react";

import { Plus } from "lucide-react";
import { useExchangeStore } from "@/zustand/useExchangeStore";
import { useTradeStore } from "@/zustand/useTradeStore";
import { cutByStepSize, fNumber } from "@/shared/utils/format-number";
import PrimaryButton from "@/shared/components/button/primary-button";
import { Field, Form } from "@/shared/components/hook-form";
import { createOrder, useSpotBalances } from "../hooks/remote/useExchange";
import PercentSlider from "@/shared/components/slider/percent-slider";
import type { OrderSide } from "../types";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateQueries } from "@/shared/hooks/local/useRefreshData";

interface Props {
  orderType: string;
}

// Helper removed, using exInfo property
const TradeSpotLimit = ({ orderType }: Props) => {
  const { invalidate } = useInvalidateQueries();
  const { exInfo } = useExchangeStore();
  const { currentPrice } = useTradeStore();
  const { balances } = useSpotBalances();
  const hasMounted = useRef(false);
  const defaultValues = {
    amount: "",
    price: "",
  };
  const schema = zod.object({
    amount: zod.string(),
    price: zod.string(),
    currency: zod.string().optional(),
  });
  type SchemaType = zod.infer<typeof schema>;
  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { setValue, reset, getValues } = methods;

  const { mutate: createOrderApi, isPending } = useMutation({
    mutationFn: createOrder,
  });

  const baseAsset = exInfo?.baseAssetSymbol || "BTC";
  const quoteAsset = exInfo?.quoteAssetSymbol || "USDT";

  // Get available balance
  const availableBalance =
    balances?.find(
      (b) => b.assetSymbol === (orderType === "BUY" ? quoteAsset : baseAsset)
    )?.balance || 0;

  const handlePercentChange = (percent: number) => {
    if (!currentPrice) return;

    // If BUY, availableBalance is in Quote (USDT).
    // Max Amount = (Balance * percent / 100) / Price
    // If SELL, availableBalance is in Base (BTC).
    // Max Amount = Balance * percent / 100

    let maxAmount = 0;
    const price = Number(getValues("price"));

    if (orderType === "BUY") {
      if (price > 0) {
        maxAmount = (Number(availableBalance) * percent) / 100 / price;
      }
    } else {
      maxAmount = (Number(availableBalance) * percent) / 100;
    }

    if (exInfo?.stepSize) {
      maxAmount = cutByStepSize(maxAmount, exInfo.stepSize);
    }

    setValue("amount", maxAmount.toString());
    // Also update total value
    setValue("currency", (maxAmount * price).toFixed(2));
  };

  const onTrade = async (data: SchemaType) => {
    if (!exInfo) return;

    // Payload preparation
    const price = data.price;
    let quantity = data.amount;

    // User requested: "If input USDT (Total) then auto convert to Base Qty"
    // If Amount is empty or we want to ensure consistency with Total:
    if (
      (!quantity || Number(quantity) === 0) &&
      data.currency &&
      Number(data.currency) > 0 &&
      Number(price) > 0
    ) {
      quantity = (Number(data.currency) / Number(price)).toString();
      if (exInfo?.stepSize) {
        quantity = cutByStepSize(Number(quantity), exInfo.stepSize).toString();
      } else {
        quantity = Number(quantity).toFixed(6);
      }
    }

    createOrderApi(
      {
        symbol: exInfo.symbol,
        side: orderType as OrderSide,
        type: "SPOT",
        orderType: "LIMIT",
        price,
        quantity,
        timeInForce: "GTC",
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
  const fSetPrice = (amount: number) => {
    if (!exInfo) return;
    // Assuming price step is derived from precision if tickSize/stepSize for price is generic
    // Use stepSize for now as placeholder or 1/10^pricePrecision
    const step = exInfo.stepSize || "0.01";
    const value = cutByStepSize(Number(amount), step);
    setValue("price", value.toString());
  };
  
  useEffect(() => {
    if (!hasMounted.current && currentPrice) {
      fSetPrice(currentPrice);
      hasMounted.current = true;
    }
  }, [currentPrice]);

  return (
    <div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-smRegular text-gray-500">
          Available to Trade:
        </span>
        <span className="text-smRegular text-gray-200">
          {fNumber(availableBalance)}{" "}
          {orderType === "BUY" ? quoteAsset : baseAsset}
        </span>
        <button
          type="button"
          onClick={() => handlePercentChange(100)}
          className="w-4 h-4 p-[2px]  border-brand-500 border-2 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors"
        >
          <Plus
            className="text-brand-500 font-bold hover:text-white"
            size={12}
          />
        </button>
      </div>

      <div>
        <Form methods={methods} onSubmit={methods.handleSubmit(onTrade)}>
          <div className="flex flex-col gap-3 mt-4">
            <Field.Text
              name="price"
              placeholder={"Price"}
              InputProps={{
                endAdornment: (
                  <div className="mr-2 text-gray-200">{quoteAsset}</div>
                ),
              }}
              onChange={(e) => {
                const p = Number(e.target.value);
                const a = Number(getValues("amount"));
                if (p && a) {
                  setValue("currency", (p * a).toString());
                }
                setValue("price", e.target.value);
              }}
            />
            <Field.Text
              name="amount" // Note: Schema calls it 'amount', backend 'quantity'
              InputProps={{
                endAdornment: (
                  <div className="mr-2 text-gray-200">{baseAsset}</div>
                ),
              }}
              placeholder={"Amount"}
              onChange={(e) => {
                const a = Number(e.target.value);
                const p = Number(getValues("price")) || currentPrice;
                if (p) {
                  setValue("currency", (a * p).toString());
                }
                setValue("amount", e.target.value);
              }}
            />
            <div className="px-3">
              <PercentSlider value={0} onChange={handlePercentChange} />
            </div>
            <Field.Text
              name="currency" // "currency" added to schema as optional
              InputProps={{
                endAdornment: (
                  <div className="mr-2 text-gray-200">{quoteAsset}</div>
                ),
              }}
              placeholder={"Total Value"}
              onChange={(e) => {
                const t = Number(e.target.value);
                const p = Number(getValues("price")) || currentPrice;
                if (p && t) {
                  // Recalculate Amount
                  const newAmount = t / p;
                  setValue(
                    "amount",
                    exInfo?.stepSize
                      ? cutByStepSize(newAmount, exInfo.stepSize).toString()
                      : newAmount.toFixed(6)
                  );
                }
                setValue("currency", e.target.value);
              }}
            />
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
                {fNumber(0)} USDT
              </span>
            </div>
            <div className="flex gap-1 mt-2 justify-between">
              <span className="text-smRegular text-gray-500">Est.Fee:</span>
              <span className="text-smRegular text-gray-200">-- BTC</span>
            </div>
            <div className="flex gap-1 mt-2 justify-between">
              <span className="text-smRegular text-gray-500">Max:</span>
              <span className="text-smRegular text-gray-200">
                {fNumber(0)} USDT
              </span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default TradeSpotLimit;
