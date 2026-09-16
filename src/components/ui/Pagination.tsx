import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  className,
  itemLabel = "requests",
}) => {
  return (
    <div
      className={cn(
        "p-3.5 border-t border-[#D9DDD7]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#68716B] font-label-sm bg-white",
        className
      )}
    >
      <div>
        Showing{" "}
        <span className="font-medium text-[#181C1A]">
          {startIndex} - {endIndex}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#181C1A]">
          {totalItems.toLocaleString()}
        </span>{" "}
        {itemLabel}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span>
          Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
        </span>
        <div className="inline-flex gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              "p-1 rounded border border-[#D9DDD7] transition-colors",
              currentPage <= 1
                ? "text-[#68716B] opacity-40 cursor-not-allowed"
                : "text-[#181C1A] hover:bg-[#F0F1EE]"
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              "p-1 rounded border border-[#D9DDD7] transition-colors",
              currentPage >= totalPages
                ? "text-[#68716B] opacity-40 cursor-not-allowed"
                : "text-[#181C1A] hover:bg-[#F0F1EE]"
            )}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
