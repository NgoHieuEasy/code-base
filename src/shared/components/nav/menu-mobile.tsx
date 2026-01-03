import PrimaryButton from "../button/primary-button";
import { useIsLoggedIn } from "@/zustand/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CloseIcon from "@/assets/icons/header/close-icon";
import CopyIcon from "@/assets/icons/common/copy-icon";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import { useHeaderMenu } from "@/hooks/components/useHeaderMenu";

export interface Props {
  open: boolean;
  onClose: () => void;
}
export const MenuMobile = ({ open, onClose }: Props) => {
  const isLogged = useIsLoggedIn();
  const { open: openAppKit, close: closeAppKit } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const location = useLocation();

  const { menuItems, active, setActive } = useHeaderMenu();

  useEffect(() => {
    const item = menuItems.find((item) => item.route === location.pathname);
    setActive(item?.route ?? "");
  }, [location.pathname]);

  const handleClick = (route: string) => {
    setActive(route);
    navigate(route);
    onClose();
  };
  const handleConnectWallet = () => {
    openAppKit({ view: "Connect", namespace: "eip155" });
  };

  return (
    <div>
      {" "}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#0e1020] z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 bg-card-primary ">
          <button onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="logo" />
          </button>

          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                onClose();
              }}
              className="relative"
            ></div>

            <button
              className="border border-white/30 w-10  h-10 flex items-center justify-center rounded-[4px]"
              onClick={onClose}
            >
              {" "}
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="px-4 mt-3">
          {/* Menu Items */}
          {menuItems.map((item) => (
            <div key={item.title}>
              <button
                onClick={() => handleClick(item.route)}
                className={`w-full text-left pl-3 py-3 text-[17px] font-medium 
              ${active === item.route ? "text-blue-400" : "text-white"}
              
            `}
              >
                {item.title}
              </button>

              <div className="border-b border-[#007AFD80]/40"></div>
            </div>
          ))}
          {/* connected */}
          {isConnected && (
            <div className="border border-white/30 w-full  rounded-lg p-3 mt-5">
              <div className="flex items-center gap-3">
                <span className="text-mdSemiBold gray-100">0x75…9a49</span>
                <button className="opacity-70 hover:opacity-100">
                  <CopyIcon />
                </button>
              </div>
              <div>
                <p className="text-smSemiBold my-4 text-gray-50">
                  Total value of Perpetual Account
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PrimaryButton
                  text="Deposit"
                  onClick={() => {}}
                  className="rounded h-10"
                />
                <PrimaryButton
                  text="Withdraw"
                  className="bg-transparent border border-brand-500 text-brand-500 rounded h-10"
                  onClick={() => {}}
                />
                <PrimaryButton
                  text="Transfer"
                  className="bg-transparent border border-brand-500 text-brand-500 rounded h-10"
                  onClick={() => {}}
                />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-smSemiBold">Spot overview</p>

                <div className="flex justify-between text-sm opacity-70">
                  <span className="text-xsRegular text-gray-400">
                    BTC Available
                  </span>
                  <span className="text-xsRegular text-gray-100 text-[16px]">
                    0.00000000
                  </span>
                </div>

                <div className="flex justify-between text-sm opacity-70">
                  <span className="text-xsRegular  text-gray-400">
                    USDT Available
                  </span>
                  <span className="text-xsRegular text-gray-100 text-[16px]">
                    0.00000000
                  </span>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <p className="text-smSemiBold">Perpetual overview</p>

                <div className="flex justify-between text-sm opacity-70">
                  <span className="text-xsRegular text-gray-400">
                    BTC Available
                  </span>
                  <span className="text-xsRegular text-gray-100 text-[16px]">
                    0.00000000
                  </span>
                </div>

                <div className="flex justify-between text-sm opacity-70">
                  <span className="text-xsRegular  text-gray-400">
                    USDT Available
                  </span>
                  <span className="text-xsRegular text-gray-100 text-[16px]">
                    0.00000000
                  </span>
                </div>
              </div>
            </div>
          )}

          <PrimaryButton
            onClick={() => {
              if (isConnected) {
                disconnect();
              } else {
                handleConnectWallet();
              }
            }}
            className={`mt-5  ${isConnected ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600"} text-white"}
           text-white`}
            text={isConnected ? " Disconnect" : "Connect"}
          />
        </div>
      </div>
    </div>
  );
};
