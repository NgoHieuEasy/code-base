
import { useNavigate } from "react-router-dom";
import ConnectWallet from "./connect-wallet";
import { motion } from "framer-motion";
import { memo } from "react";
import { useHeaderMenu } from "@/shared/hooks/local/useHeaderMenu";

const HeaderDesktop = () => {
  const { menuItems, active } = useHeaderMenu();
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(route);
  };
  return (
    <div className="flex justify-between items-center w-full h-full px-3 z-[50]">
      <div className="flex gap-3">
        <button onClick={() => navigate("/")}>
          <img src="/logo.svg" alt="logo" />
        </button>
        <div className="flex gap-5 ml-6 relative">
          {menuItems.map((item) => (
            <div key={item.title} className="relative">
              <button
                onClick={() => handleClick(item.route)}
                className={`w-full text-left py-3 text-mdMedium ${
                  active === item.route ? "text-brand-500" : "text-white"
                }`}
              >
                {item.title}
              </button>

              {active === item.route && (
                <motion.div
                  layoutId="underline"
                  className="border-b border-brand-500 absolute left-0 right-0 bottom-0"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <ConnectWallet />
    </div>
  );
};

export default memo(HeaderDesktop);
