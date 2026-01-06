import { useEffect, useRef, useState } from "react";

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabComponentsProps {
  tabs: TabItem[];
  defaultActiveKey?: string;
  headerWidth?: string;
  type?: "trade" | "order" | string;
  onTab?: (value: string) => void;
}

const TradesTab = ({
  tabs,
  defaultActiveKey,
  headerWidth,
  type,
  onTab,
}: TabComponentsProps) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? tabs[0]?.key);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 🔥 Tự cuộn đến tab đang active
  useEffect(() => {
    const activeTab = tabRefs.current[activeKey];
    if (activeTab && containerRef.current) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeKey]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        id={type === "trade" ? "limit-market" : "order-type"}
        ref={containerRef}
        className={`flex gap-5 pt-[13px] overflow-x-auto scrollbar-hide`}
      >
        {tabs.map((tab) => (
          <div
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            onClick={() => {
              setActiveKey(tab.key);
              onTab?.(tab.key);
            }}
            className={`text-center cursor-pointer pb-1 whitespace-nowrap transition-colors text-[13px] font-bold  ${headerWidth ?? "w-fit"} ${
              activeKey === tab.key
                ? "border-b-2 border-primary-color "
                : "dark:text-gray-500 "
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Nội dung của tab */}
      <div>{tabs.find((tab) => tab.key === activeKey)?.content}</div>
    </div>
  );
};
export default TradesTab;
