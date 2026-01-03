import { useWalletManager } from "@/shared/hooks/local/useWalletManager";
import { ACCESS_TOKEN } from "@/shared/utils/constants";
import { memo } from "react";

const ConnectWallet = () => {
  const { isConnected, openConnectModal, disconnect, coinLogo } =
    useWalletManager();

  return (
    <div>
      <div className="flex gap-2 w-fit">
        <button
          type="button"
          onClick={() => {
            if (isConnected) {
              disconnect();
              localStorage.removeItem(ACCESS_TOKEN);
            } else {
              openConnectModal({ view: "Connect", namespace: "eip155" });
            }
          }}
          className={`px-6  h-10  rounded-[4px] transition-colors duration-200
           ${
             isConnected
               ? "bg-red-500 hover:bg-red-600 text-white"
               : "bg-blue-500 hover:bg-blue-600"
           }
           text-white`}
        >
          {isConnected ? " Disconnect" : "Connect"}
        </button>

        {isConnected && (
          <button
            onClick={() => openConnectModal({ view: "Networks" })}
            className="flex items-center gap-2 px-4 py-2 h-10 rounded-xl  transition text-white border border-white/30"
          >
            {coinLogo && (
              <img
                src={coinLogo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ConnectWallet);
