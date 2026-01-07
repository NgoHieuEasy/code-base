import React, { useRef, useState } from "react";
import ConnectWallet from "../nav/connect-wallet";
import { useWalletManager } from "@/shared/hooks/local/useWalletManager";

export type ColumnDef<T> = {
  field: keyof T;
  headerName?: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number; //
  sort?: boolean;
  algin?: "center" | "start" | "end";
  title?: boolean;
};

type TableCoreProps<T> = {
  rowData: T[];
  columnDefs: ColumnDef<T>[];
  loading?: boolean;
  onSort?: (sort: { field: keyof T; direction: "asc" | "desc" | "" }) => void;
  title?: boolean;
};

export function TableCore<T extends object>({
  rowData,
  columnDefs,
  loading = false,
  onSort,
}: TableCoreProps<T>) {
  const { isConnected } = useWalletManager();
  const [sortState, setSortState] = useState<{
    field: keyof T | null;
    direction: "asc" | "desc" | "";
  }>({ field: null, direction: "" });
  const tableRef = useRef<HTMLTableElement>(null);

  const handleSortClick = (col: ColumnDef<T>) => {
    if (!col.sort) return;

    setSortState((prev) => {
      let newDirection: "asc" | "desc" | "" = "asc";
      if (prev.field === col.field) {
        if (prev.direction === "asc") newDirection = "desc";
        else if (prev.direction === "desc") newDirection = "";
      }

      const newState = {
        field: col.field,
        direction: newDirection,
      };
      onSort?.(newState);
      return newState;
    });
  };

  return (
    <div className="">
      <div>
        <table
          ref={tableRef}
          className="min-w-full border border-gray-300 rounded-lg overflow-hidden"
        >
          <thead className="">
            <tr>
              {columnDefs.map((col, idx) => (
                <th
                  key={`${col.headerName} + ${idx}`}
                  onClick={() => handleSortClick(col)}
                  className="px-3 py-2 text-center text-sm relative"
                >
                  <div
                    className={`flex items-center  text-[13px] text-[#838384] ${
                      col.algin ? `justify-${col.algin}` : "justify-center"
                    }`}
                  >
                    <span className="text-xsMedium text-gray-500">
                      {col.headerName ?? String(col.field)}
                    </span>

                    {/* Hiện icon sort nếu có */}
                    {col.sort && (
                      <span className="ml-1 hover:cursor-pointer">
                        {sortState.field === col.field
                          ? sortState.direction === "asc"
                            ? "▲"
                            : sortState.direction === "desc"
                            ? "▼"
                            : "⇅"
                          : "⇅"}
                      </span>
                    )}
                  </div>

                  {/* Thanh kéo resize */}
                  <div className="absolute top-0 right-0 h-full w-1  select-none" />
                </th>
              ))}
            </tr>
          </thead>
          {isConnected ? (
            <tbody className="">
              {loading &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    {columnDefs.map((_, cIdx) => (
                      <td key={cIdx} colSpan={1} className=" px-3 py-2">
                        <div className="h-4 w-full bg-slate-300 dark:bg-gray-500 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              {/* No Data */}

              {!loading && rowData.length === 0 && (
                <tr className="text-black dark:text-white">
                  <td
                    colSpan={columnDefs.length}
                    className="text-center py-10 "
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex flex-col items-center justify-center w-[60px] h-[60px] bg-[#2EBDB11A] rounded-full p-4">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.6668 11.6667L19.8076 7.94819C19.2725 6.87801 19.0049 6.34288 18.6058 5.95194C18.2528 5.60622 17.8274 5.34329 17.3603 5.18218C16.8321 5 16.2338 5 15.0373 5H8.66683C6.79999 5 5.86657 5 5.15353 5.36331C4.52632 5.68289 4.01639 6.19282 3.69681 6.82003C3.3335 7.53307 3.3335 8.46649 3.3335 10.3333V11.6667M3.3335 11.6667H28.6668C31.4671 11.6667 32.8672 11.6667 33.9368 12.2116C34.8776 12.691 35.6425 13.4559 36.1219 14.3967C36.6668 15.4663 36.6668 16.8664 36.6668 19.6667V27C36.6668 29.8003 36.6668 31.2004 36.1219 32.27C35.6425 33.2108 34.8776 33.9757 33.9368 34.455C32.8672 35 31.4671 35 28.6668 35H11.3335C8.53323 35 7.1331 35 6.06354 34.455C5.12273 33.9757 4.35783 33.2108 3.87846 32.27C3.3335 31.2004 3.3335 29.8003 3.3335 27V11.6667Z"
                            stroke="#2EBDB1"
                            strokeWidth="3.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <span className="text-sm">{"NO DATA"}</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                rowData.length > 0 &&
                rowData.map((row: any, rIdx) => (
                  <tr key={rIdx} className="">
                    {columnDefs.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3 py-2 text-smMedium  text-[#999999]`}
                        title={`${col.title ? row[col.field] : ""}`}
                      >
                        <div
                          className={`flex ${
                            col.algin
                              ? `justify-${col.algin}`
                              : "justify-center"
                          }`}
                        >
                          {col.render
                            ? col.render(row[col.field], row)
                            : row[col.field]
                            ? String(row[col.field])
                            : 0}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td
                  colSpan={columnDefs.length}
                  className="text-center py-10 space-y-4 text-black dark:text-white"
                >
                  <p className="text-gray-500">
                    Please connect your wallet first
                  </p>
                  <div className=" flex justify-center items-center">
                    <ConnectWallet />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
