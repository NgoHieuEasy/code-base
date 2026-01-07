// TableHead.tsx
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface ColumnDef {
    key: string;                   
    label: string | React.ReactNode;
    sorter?: boolean;              
}

type SortDirection = "asc" | "desc";
interface SortState { key: string; direction: SortDirection; }

interface TableHeadProps {
    columns: ColumnDef[];
    onSortChange?: (state: SortState) => void;
    isDark?: boolean;
}

export const TableHead: React.FC<TableHeadProps> = ({
    columns,
    onSortChange,
    isDark = false,
}) => {
    const [sortState, setSortState] = useState<SortState | null>(null);

    const handleSort = (col: ColumnDef) => {
        if (!col.sorter) return;

        setSortState((prev) => {
            const next: SortState =
                !prev || prev.key !== col.key
                    ? { key: col.key, direction: "asc" }
                    : { key: col.key, direction: prev.direction === "asc" ? "desc" : "asc" };

            onSortChange?.(next);
            return next;
        });
    };

    const renderIcon = (colKey: string) => {
        if (!sortState || sortState.key !== colKey) return null;
        return sortState.direction === "asc" ? (
            <ChevronUp size={14} className="inline ml-1" />
        ) : (
            <ChevronDown size={14} className="inline ml-1" />
        );
    };

    return (
        <thead>
            <tr className={clsx(isDark ? "bg-neutrals-610" : "bg-neutrals-250")}>
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className={clsx(
                            "py-[17px] px-[50px] font-semibold select-none",
                            col.sorter && "cursor-pointer hover:opacity-80"
                        )}
                        onClick={() => handleSort(col)}
                    >
                        {col.label}
                        {col.sorter && renderIcon(col.key)}
                    </th>
                ))}
            </tr>
        </thead>
    );
};
