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
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages || totalPages <= 0;

  const displayStart = totalItems > 0 ? startIndex : 0;
  const displayEnd = totalItems > 0 ? endIndex : 0;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-2.5 border-t border-border-default bg-surface px-4 py-3 font-label-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        Showing{" "}
        <span className="font-medium text-text-primary">
          {displayStart} - {displayEnd}
        </span>{" "}
        of{" "}
        <span className="font-medium text-text-primary">
          {totalItems.toLocaleString()}
        </span>{" "}
        {itemLabel}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="whitespace-nowrap">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={isPreviousDisabled}
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded border border-border-default text-text-secondary transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              "hover:bg-surface-muted hover:text-text-primary",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary",
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            aria-label="Next page"
            disabled={isNextDisabled}
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded border border-border-default text-text-secondary transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              "hover:bg-surface-muted hover:text-text-primary",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary",
            )}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
