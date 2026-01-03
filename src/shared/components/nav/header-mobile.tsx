import { Menu } from "lucide-react";
import { useState } from "react";
import { MenuMobile } from "./menu-mobile";

import ConnectWallet from "./connect-wallet";

const HeaderMobile = () => {
  const [open, setOpen] = useState({
    menu: false,
  });

  return (
    <div className=" flex items-center h-20 bg-card-primary px-2">
      <div className="flex justify-between items-center w-full">
        <img src="/logo.svg" alt="logo" />

        <div className="flex items-center gap-2">
          <ConnectWallet />

          <button
            onClick={() => setOpen((prev) => ({ ...prev, menu: true }))}
            className="border border-white/30 w-10  h-10 flex items-center justify-center rounded-[4px]"
          >
            <Menu />
          </button>
        </div>
      </div>
      <MenuMobile
        onClose={() => setOpen((prev) => ({ ...prev, menu: false }))}
        open={open.menu}
      />
    </div>
  );
};

export default HeaderMobile;
