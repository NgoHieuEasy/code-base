import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Props) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`${className} flex items-center justify-center w-full gap-3 text-black text-[16px] dark:text-white ${className}`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 flex items-center justify-center  rounded text-white bg-[#19222b] ${
          currentPage === 1
            ? "bg-[#19222b]/40 opacity-50 cursor-not-allowed"
            : "bg-[#19222b] hover:bg-[#22303c] cursor-pointer"
        }`}
      >
        <ChevronLeft />
      </button>

      {pages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded  transition${
              page === currentPage
                ? "text-white bg-[#19222b]"
                : " text-inactive-2"
            } hover:cursor-pointer`}
          >
            {page}
          </button>
        ) : (
          <span key={index + "s"} className="px-2">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center  rounded text-white bg-[#19222b] ${
          currentPage === totalPages
            ? "bg-[#19222b]/40 opacity-50 cursor-not-allowed"
            : "bg-[#19222b] hover:bg-[#22303c] cursor-pointer"
        }`}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
