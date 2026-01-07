import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useEffect } from "react";
import PanelPopup from "@/shared/components/popup/panel-popup";
import { fNumber } from "@/shared/utils/format-number";
import { Field, Form } from "@/shared/components/hook-form";
import PrimaryButton from "@/shared/components/button/primary-button";

interface Props {
  open: boolean;
  onClose: () => void;
  position: Position | null;
}

const TpSlPositionModal = ({ open, onClose, position }: Props) => {
  const { mutate: setTpSl, isPending } = useSetPositionTpSl();

  const defaultValues = {
    takeProfitPrice: "",
    stopLossPrice: "",
  };

  const schema = zod.object({
    takeProfitPrice: zod.string().optional(),
    stopLossPrice: zod.string().optional(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (open && position) {
      // If we had existing TP/SL values attached to position, prefill them.
      // But Position interface doesn't show TP/SL fields yet.
      // Assuming fresh start for now.
      reset({ takeProfitPrice: "", stopLossPrice: "" });
    }
  }, [open, position, reset]);

  const onSubmit = (data: {
    takeProfitPrice?: string;
    stopLossPrice?: string;
  }) => {
    if (!position) return;

    setTpSl(
      {
        positionId: position.id,
        takeProfitPrice: data.takeProfitPrice
          ? Number(data.takeProfitPrice)
          : undefined,
        stopLossPrice: data.stopLossPrice
          ? Number(data.stopLossPrice)
          : undefined,
      },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={"Take Profit / Stop Loss"}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>
            Symbol:{" "}
            <span className="text-white font-semibold">{position?.symbol}</span>
          </span>
          <span>
            Entry Price:{" "}
            <span className="text-white">
              {fNumber(position?.entryPrice || 0)}
            </span>
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>
            Side:{" "}
            <span
              className={
                position?.side === "LONG" ? "text-green-500" : "text-red-500"
              }
            >
              {position?.side}
            </span>
          </span>
          <span>
            Mark Price:{" "}
            <span className="text-white">
              {fNumber(position?.markPrice || 0)}
            </span>
          </span>
        </div>

        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-400">Take Profit Price</span>
              <Field.Text
                name="takeProfitPrice"
                placeholder="Enter Price"
                type="number"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-400">Stop Loss Price</span>
              <Field.Text
                name="stopLossPrice"
                placeholder="Enter Price"
                type="number"
              />
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
                text={isPending ? "Confirming..." : "Confirm"}
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

export default TpSlPositionModal;
