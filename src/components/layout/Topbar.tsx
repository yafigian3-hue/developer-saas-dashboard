import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Download, Menu, PanelRightOpen, Search, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenDrawer?: () => void;
  onOpenSettings?: () => void;
  onExportReport?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const PLACEHOLDER_FULL = "Search requests, endpoints, IDs, or IPs...";
const PLACEHOLDER_COMPACT = "Search requests…";

const iconButton = cn(
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-secondary lg:h-8 lg:w-8",
  "transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary active:bg-surface-muted",
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary",
);

export const Topbar: FC<TopbarProps> = ({
  onOpenMobileSidebar,
  onOpenDrawer,
  onOpenSettings,
  onExportReport,
  searchQuery,
  onSearchChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (
        event.key === "/" &&
        target?.tagName !== "INPUT" &&
        target?.tagName !== "TEXTAREA" &&
        !target?.isContentEditable
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const updatePlaceholder = () => {
      if (searchInputRef.current) {
        searchInputRef.current.placeholder = mediaQuery.matches
          ? PLACEHOLDER_COMPACT
          : PLACEHOLDER_FULL;
      }
    };

    updatePlaceholder();
    mediaQuery.addEventListener("change", updatePlaceholder);

    return () => {
      mediaQuery.removeEventListener("change", updatePlaceholder);
    };
  }, []);

  const hasContextualActions = Boolean(onOpenDrawer || onExportReport);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 min-w-0 items-center gap-1 border-b border-border-default bg-surface px-3 sm:gap-2 sm:px-4 lg:left-60 lg:px-6">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label="Open navigation menu"
        className={cn(iconButton, "-ml-2 text-text-primary lg:hidden")}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1 sm:flex-none">
        <div className="group relative flex h-9 w-full max-w-[560px] items-center sm:h-8 sm:w-[420px] lg:w-[480px]">
          <Search
            className="pointer-events-none absolute left-0 h-4 w-4 text-text-secondary/70 transition-colors duration-150 group-focus-within:text-text-primary"
            aria-hidden="true"
          />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.blur();
              }
            }}
            placeholder={PLACEHOLDER_FULL}
            aria-label="Search requests"
            autoComplete="off"
            className={cn(
              "peer h-full w-full min-w-0 truncate border-b border-border-default bg-transparent pl-6 pr-8 text-[14px] text-text-primary outline-none",
              "placeholder:text-text-secondary/60",
              "transition-colors duration-150",
              "hover:border-text-secondary/50",
              "focus:border-accent sm:text-[13px]",
            )}
          />

          <kbd className="pointer-events-none absolute right-0 hidden rounded border border-border-default bg-surface px-1.5 py-0.5 font-code-inline text-[10px] leading-none text-text-secondary transition-opacity duration-150 peer-focus:opacity-0 sm:block">
            /
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {onOpenDrawer && (
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open inspect drawer"
            title="Inspect request"
            className={iconButton}
          >
            <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {onExportReport && (
          <button
            type="button"
            onClick={onExportReport}
            aria-label="Export report"
            title="Export report"
            className={iconButton}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {hasContextualActions && (
          <div
            className="mx-1 h-4 w-px bg-border-default sm:mx-1.5"
            aria-hidden="true"
          />
        )}

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
            className={cn(iconButton, "hidden sm:ml-3 sm:inline-flex")}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
};
