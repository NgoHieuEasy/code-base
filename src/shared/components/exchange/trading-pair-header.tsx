import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLET_SCREEN } from "@/shared/utils/constants";
import { useMediaQuery } from "react-responsive";
import MarketList from "./market-list";
import MarketItem from "./market-item";
import PanelPopup from "../popup/panel-popup";


const TradingPairHeader = ({ marketType }: { marketType: "SPOT" | "FUTURES" }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery({
    query: `(min-width: ${TABLET_SCREEN}px)`,
  });

  const [open, setOpen] = useState({
    search: false,
    searchDesktop: false,
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen((prev) => ({ ...prev, searchDesktop: false }));
      }
    };

    if (open.searchDesktop) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open.searchDesktop]);
  return (
    <div className="relative ">
      <MarketItem
        marketType={marketType}
        onClick={() => {
          if (isDesktop) {
            setOpen((prev) => ({ ...prev, searchDesktop: true }));
            return;
          }

          setOpen((prev) => ({ ...prev, search: true }));
        }}
      />

      {open.search && (
        <PanelPopup
          open={open.search}
          onClose={() => setOpen((prev) => ({ ...prev, search: false }))}
        >
          <MarketList
            marketType={marketType}
            onClick={() => setOpen((prev) => ({ ...prev, search: false }))}
          />
        </PanelPopup>
      )}

      <AnimatePresence>
        {open.searchDesktop && (
          <motion.div
            ref={popupRef}
            className="absolute left-10 top-[105px] w-[550px] bg-card-primary border border-gray-700 rounded-[5px] shadow-xl z-[999]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <MarketList
              marketType={marketType}
              onClick={() =>
                setOpen((prev) => ({ ...prev, searchDesktop: false }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradingPairHeader;
