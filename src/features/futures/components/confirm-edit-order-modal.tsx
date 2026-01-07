import PrimaryButton from "@/shared/components/button/primary-button";
import PanelPopup from "@/shared/components/popup/panel-popup";
import { fNumber } from "@/shared/utils/format-number";
import { useChartStore } from "@/zustand/useChartStore";
import { useLocalStorage } from "@/zustand/useLocalStorage";
const DEFAULT_ORDER = {
  open: false,
  callback: () => {},
  order: {
    price: 0,
    qty: 0,
    symbol: "",
    type: "",
  },
  onCancel: () => {},
};

const ConfirmEditOrderModal = () => {
  const { editOrderData, setEditOrderData } = useChartStore();
  const [doNotShowAgain, setDoNotShowAgain] = useLocalStorage(
    "SHOW_CONFIRM_EDIT",
    false
  );
  const { open, order, callback, onCancel } = editOrderData;

  if (!open) return null;

  return (
    <PanelPopup
      open={open}
      onClose={onCancel}
      title={"Confirm Edit Order"}
      className="max-w-sm"
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Symbol:</span>
          <span className="text-white font-semibold">{order.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Type:</span>
          <span className="text-brand-500 font-semibold">{order.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">New Price:</span>
          <span className="text-white font-semibold">
            {fNumber(order.price)}
          </span>
        </div>
        <button
          className="text-sm text-white mt-3 flex items-center justify-between w-full"
          onClick={() => setDoNotShowAgain(!doNotShowAgain)}
        >
          <div className="flex items-center w-full">
            <p className="w-fit text-font-80 mr-5">Do not show again.</p>
            <div
              className={`w-[15px] p-0.5 h-[15px] rounded border ${
                doNotShowAgain
                  ? "border-base_color"
                  : "border-[rgba(255,255,255,0.3)]"
              } transition-all duration-100 ease-in-out`}
            >
              <div
                className={`w-full h-full rounded-[1px] bg-base_color ${
                  doNotShowAgain ? "opacity-100" : "opacity-0"
                } transition-all duration-100 ease-in-out`}
              />
            </div>
          </div>
        </button>
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton
            text="Confirm"
            className="flex-1"
            onClick={() => {
              callback();
              setEditOrderData(DEFAULT_ORDER);
            }}
          />
        </div>
      </div>
    </PanelPopup>
  );
};

export default ConfirmEditOrderModal;
