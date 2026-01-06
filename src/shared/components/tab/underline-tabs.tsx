import { useState } from "react";
import { motion } from "framer-motion";
interface TabItem {
  key: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

interface TabComponentsProps {
  tabs: TabItem[];
  defaultActiveKey?: string;
  onTab?: (value: string) => void;
}

const UnderlineTabs = ({
  tabs,
  defaultActiveKey,
  onTab,
}: TabComponentsProps) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? tabs[0]?.key);

  // const containerRef = useRef<HTMLDivElement>(null);
  // const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // useEffect(() => {
  //   const activeTab = tabRefs.current[activeKey];
  //   if (activeTab && containerRef.current) {
  //     activeTab.scrollIntoView({
  //       behavior: "smooth",
  //       inline: "center",
  //       block: "nearest",
  //     });
  //   }
  // }, [activeKey]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-full relative border-b border-gray-700">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => {
              setActiveKey(tab.key);
              onTab?.(tab.key);
            }}
            className={`relative flex text-[16px] w-full h-[40px] gap-2 p-[10px] justify-center items-center 
        ${activeKey === tab.key ? "text-white" : "text-gray-250"} 
        hover:cursor-pointer`}
          >
            {tab.label}

            {(tab.count ?? 0) > 0 && (
              <div
                className={`h-6 px-1 text-smMedium border flex items-center justify-center rounded-full
            ${
              activeKey === tab.key
                ? "border-white bg-gray-600 text-white"
                : "border-white bg-white text-black"
            }
          `}
              >
                {(tab.count ?? 0) > 99 ? "99+" : tab.count}
              </div>
            )}

            {/* Underline animation */}
            {activeKey === tab.key && (
              <motion.div
                layoutId={defaultActiveKey}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>

      <div>{tabs.find((tab) => tab.key === activeKey)?.content}</div>
    </div>
  );
};
export default UnderlineTabs;
