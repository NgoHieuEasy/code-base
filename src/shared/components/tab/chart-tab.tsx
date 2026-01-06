import { useEffect, useRef, useState } from "react";

interface TabProps {
  data: { _id: string; name: string }[];
  onTabClick: (id: string) => void;
  type?: "bold" | "light";
  className?: string;
}

const ChartTab = ({
  data,
  onTabClick,
  className = "min-w-[200px] ssm:min-w-[120px] sm:w-[180px] lg:w-full lg:px-2 px-4 py-1 text-[11px] ssm:text-sm ",
}: TabProps) => {
  const [activeCategory, setActiveCategory] = useState(data[0]?._id);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    if (activeTab && containerRef.current) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        inline: "center", // canh giữa
        block: "nearest",
      });
    }
  }, [activeCategory]);
  return (
    <div
      ref={containerRef}
      className={`flex gap-2 w-full lg:p-2 my-0 p-2 mdLg:border-0 border-t border-[#fff] dark:border-[#3E4047]
    overflow-x-auto scrollbar-hide `}
    >
      {data.map((category) => (
        <button
          key={category._id}
          ref={(el) => {
            tabRefs.current[category._id] = el;
          }}
          className={`transition font-bold hover:cursor-pointer ${className}
              ${
                activeCategory === category._id
                  ? `border-b-2 border-primary-color`
                  : "text-gray-500"
              }
            `}
          onClick={() => {
            setActiveCategory(category._id);
            onTabClick(category._id);
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
