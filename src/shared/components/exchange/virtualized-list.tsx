import { useState, useRef, useCallback, useEffect } from "react";

type VirtualizedListProps<T> = {
  items: T[];
  itemHeight: number;
  windowHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

function VirtualizedList<T>({
  items,
  itemHeight,
  windowHeight,
  renderItem,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const visibleItemCount = Math.ceil(windowHeight / itemHeight);
  const totalHeight = items.length * itemHeight;

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const onScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", onScroll);
      return () => listElement.removeEventListener("scroll", onScroll);
    }
  }, [onScroll]);

  const displayItems = () => {
    const visibleItems: React.ReactNode[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      const item = items[i];
      const itemStyle: React.CSSProperties = {
        position: "absolute",
        top: `${i * itemHeight}px`,
        height: `${itemHeight}px`,
        left: 0,
        right: 0,
      };

      visibleItems.push(
        <div key={i} style={itemStyle}>
          {renderItem(item, i)}
        </div>
      );
    }

    return visibleItems;
  };

  return (
    <div
      ref={listRef}
      style={{
        height: `${windowHeight}px`,
        overflowY: "auto",
        position: "relative",
        willChange: "transform",
      }}
    >
      <div style={{ height: `${totalHeight}px` }}>{displayItems()}</div>
    </div>
  );
}

export default VirtualizedList;
