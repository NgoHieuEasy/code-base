
import { useCallback, useEffect, useRef } from "react";
import { useSocketTicker } from "./useTicker";

type RealTimePriceType = {
  symbol: string;
  baseTitle: string;
  initialPrice: number;
};

const PriceTitleUpdate = ({
  symbol,
  baseTitle,
  initialPrice,
}: RealTimePriceType) => {
  const markPrice = useSocketTicker(symbol);
  const initialRender = useRef(true);

  const updateTitle = useCallback(
    (price: number) => {
      if (price && price !== 0) {
        const formattedPrice = price;
        document.title = `${formattedPrice} | ${baseTitle}`;
      }
    },
    [baseTitle]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (initialRender.current) {
      updateTitle(initialPrice);
      initialRender.current = false;
    } else if (markPrice?.p && markPrice.p !== 0) {
      timeoutId = setTimeout(() => updateTitle(markPrice.p), 500);
    }

    return () => clearTimeout(timeoutId);
  }, [markPrice, updateTitle, initialPrice]);

  return null;
};

export default PriceTitleUpdate;
