import React, { useState, useRef, useCallback, useEffect } from "react";

interface PercentSliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const PercentSlider: React.FC<PercentSliderProps> = ({
  value = 0,
  onChange,
}) => {
  const [percent, setPercent] = useState(value);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    setPercent(value);
  }, [value]);

  // Convert mouse position → percent
  const calcPercent = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return percent;
      const rect = sliderRef.current.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      return Math.round(pos);
    },
    [percent]
  );

  const updateValue = useCallback(
    (p: number) => {
      setPercent(p);
      onChange?.(p);
    },
    [onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return;
      updateValue(calcPercent(e.clientX));
    },
    [calcPercent, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const startDrag = (e: React.MouseEvent) => {
    dragging.current = true;
    updateValue(calcPercent(e.clientX));
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative w-full py-6 select-none">
      {/* Tooltip */}
      <div
        className="absolute -top-2 text-xs px-2 py-1 rounded bg-[#1e293b] text-white shadow transition-all"
        style={{
          left: `calc(${percent}% - 18px)`,
        }}
      >
        {percent}%
      </div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="relative w-full h-4 flex items-center"
        onMouseDown={startDrag}
      >
        {/* Track */}
        <div className="absolute w-full h-[4px] bg-[#2a3340] rounded-full" />

        {/* Range (filled part) */}
        <div
          className="absolute h-[4px] bg-[#1d4ed8] rounded-full"
          style={{ width: `${percent}%` }}
        />

        {/* Marks 0,25,50,75,100 */}
        <div className="absolute w-full flex justify-between z-10 pointer-events-none">
          {[0, 25, 50, 75, 100].map((m) => (
            <div key={m} className="w-2 h-2 rounded-full bg-[#4b5563] " />
          ))}
        </div>

        {/* Thumb */}
        <div
          className="absolute w-4 h-4 bg-[#0f172a] border-2 border-[#3b82f6] rounded-full shadow z-20"
          style={{
            left: `calc(${percent}% - 8px)`,
          }}
        />
      </div>
    </div>
  );
};

export default PercentSlider;
