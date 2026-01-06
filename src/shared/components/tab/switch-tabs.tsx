import { useEffect, useRef, useState } from "react";

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabComponentsProps {
  tabs: TabItem[];
  defaultActiveKey?: string;
  onTab?: (value: string) => void;
}

const SwitchTabs = ({ tabs, defaultActiveKey, onTab }: TabComponentsProps) => {
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
        ref={containerRef}
        className={`flex gap-2 pt-[13px] overflow-x-auto scrollbar-hide`}
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
            className={`font-semibold flex text-[16px] h-[40px] p-[10px] justify-center items-center flex-[1_0_0] rounded-[8px] ${activeKey === tab.key ? "bg-brand-500 text-black" : "bg-[#40404080] text-gray-250"} hover:cursor-pointer `}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div>{tabs.find((tab) => tab.key === activeKey)?.content}</div>
    </div>
  );
};
export default SwitchTabs;
