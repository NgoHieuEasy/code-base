import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useEffect } from "react";

import { useExchangeStore } from "@/zustand/useExchangeStore";
import { cutByStepSize, fNumber } from "@/shared/utils/format-number";
import PanelPopup from "@/shared/components/popup/panel-popup";
import { Field, Form } from "@/shared/components/hook-form";
import PercentSlider from "@/shared/components/slider/percent-slider";
import PrimaryButton from "@/shared/components/button/primary-button";
import type { IPosition } from "@/shared/types/exchange";
import { useMutation } from "@tanstack/react-query";
import { closePosition } from "@/shared/hooks/remote/useExchange";
import { useInvalidateQueries } from "@/shared/hooks/local/useRefreshData";

interface Props {
  open: boolean;
  onClose: () => void;
  position: IPosition | null;
}

const ClosePositionModal = ({ open, onClose, position }: Props) => {
  const { invalidate } = useInvalidateQueries();
  const { mutate: closePositionApi, isPending } = useMutation({
    mutationFn: closePosition,
  });
  const { exInfo } = useExchangeStore();

  const defaultValues = {
    amount: "",
  };

  const schema = zod.object({
    amount: zod.string().min(1, "Amount is required"),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { setValue, handleSubmit, reset } = methods;

  useEffect(() => {
    if (open && position) {
      // Default to 100% ? or empty?
      // Let's default to full size
      setValue(
        "amount",
        position?.size ? Math.abs(Number(position.size)).toString() : ""
      );
    }
  }, [open, position, setValue]);

  const onSubmit = (data: { amount: string }) => {
    if (!position) return;

    closePositionApi(
      {
        positionId: position.id,
        quantity: data.amount,
      },
      {
        onSuccess: () => {
          invalidate([
            ["open-orders"],
            ["portfolio-orders-history"],
            ["portfolio-balances"],
          ]);
          onClose();
          reset();
        },
        onError: (err) => {
          console.error("Failed to close position:", err);
        },
      }
    );
  };

  const handlePercentChange = (percent: number) => {
    if (!position) return;
    const size = Math.abs(Number(position.size));
    if (percent === 100) {
      setValue("amount", parseFloat(position.size).toString());
      return;
    }
    let val = (size * percent) / 100;

    if (exInfo && exInfo.stepSize) {
      val = cutByStepSize(val, exInfo.stepSize);
    } else if (exInfo && exInfo.qtyPrecision) {
      val = parseFloat(val.toFixed(exInfo.qtyPrecision));
    }

    setValue("amount", fNumber(val).replace(/,/g, ""));
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={"Close Position"}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="text-gray-400 text-sm">
          Symbol:{" "}
          <span className="text-white font-semibold">{position?.symbol}</span>
        </div>
        <div className="text-gray-400 text-sm">
          Side:{" "}
          <span
            className={
              Number(position?.size) > 0 ? "text-green-500" : "text-red-500"
            }
          >
            {Number(position?.size) > 0 ? "LONG" : "SHORT"}
          </span>
        </div>

        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Field.Text
              name="amount"
              placeholder="Amount to close"
              type="number"
            />

            <div className="px-2">
              <PercentSlider value={0} onChange={handlePercentChange} />
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <PrimaryButton
                text={isPending ? "Closing..." : "Confirm Close"}
                className="w-full"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </Form>
      </div>
    </PanelPopup>
  );
};

export default ClosePositionModal;
