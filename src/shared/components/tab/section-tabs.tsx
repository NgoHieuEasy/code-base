import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabComponentsProps {
  tabs: TabItem[];
  defaultActiveKey?: string;
  onTab?: (value: string) => void;
}

const SectionTabs = ({ tabs, defaultActiveKey, onTab }: TabComponentsProps) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? tabs[0]?.key);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Lấy index tab hiện tại
  const currentIndex = tabs.findIndex((t) => t.key === activeKey);

  // Kiểm tra điều kiện tồn tại tab trước & tab sau
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < tabs.length - 1;

  const goNext = () => {
    if (hasNext) {
      const nextKey = tabs[currentIndex + 1].key;
      setActiveKey(nextKey);
      onTab?.(nextKey);
    }
  };

  const goBack = () => {
    if (hasPrev) {
      const prevKey = tabs[currentIndex - 1].key;
      setActiveKey(prevKey);
      onTab?.(prevKey);
    }
  };

  useEffect(() => {
    const activeTab = tabRefs.current[activeKey];
    if (activeTab && containerRef.current) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }, [activeKey]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full">
        {hasPrev && (
          <button
            onClick={goBack}
            className="absolute left-0 top-[32px] -translate-y-1/2 z-10 
                       p-2 rounded-full hover:bg-black/60 transition  hidden"
            style={{
              background: "var(--Colors-Transparent-50, rgba(64,64,64,0.5))",
            }}
          >
            <ArrowLeft className="text-white" />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex gap-2 pt-[13px] overflow-x-auto scrollbar-hide"
        >
          {tabs.map((tab) => (
            <div
              key={tab.key}
              ref={(el) => {
                // if (!isMobile) return;
                tabRefs.current[tab.key] = el;
              }}
              onClick={() => {
                setActiveKey(tab.key);
                onTab?.(tab.key);
              }}
              className={`flex gap-3  text-[16px] h-[40px] p-[10px] 
                          justify-center items-center rounded-[8px] text-white cursor-pointer
                          ${activeKey === tab.key ? "bg-brand-500" : "bg-white/10"}`}
            >
              <div>{tab.icon}</div>
              <span className="text-smSemiBold whitespace-nowrap">
                {" "}
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {hasNext && (
          <button
            onClick={goNext}
            className="absolute right-0 top-[32px] -translate-y-1/2 z-10
            p-2 rounded-full hover:bg-black/60 transition hidden"
            style={{
              background: "var(--Colors-Transparent-50, rgba(64,64,64,0.5))",
            }}
          >
            <ArrowRight className="text-white" />
          </button>
        )}
      </div>

      <div>{tabs.find((tab) => tab.key === activeKey)?.content}</div>
    </div>
  );
};
export default SectionTabs;
