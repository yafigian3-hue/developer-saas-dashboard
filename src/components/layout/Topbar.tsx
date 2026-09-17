import { useEffect, useRef } from "react";
import type { FC } from "react";
import {
  Bell,
  Menu,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
} from "lucide-react";

export interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenDrawer?: () => void;
  onOpenSettings?: () => void;
  onExportReport?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

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

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-border-default bg-surface px-4 sm:px-6 lg:left-64">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-default text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search endpoints, request IDs, IPs, or logs..."
            aria-label="Search dashboard"
            className="h-8 w-full rounded border border-border-default bg-surface-muted pl-9 pr-9 text-xs text-text-primary placeholder:text-text-secondary transition-colors duration-150 focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1">
        {onOpenDrawer && (
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open inspect drawer"
            title="Open inspect drawer"
            className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}

        {onExportReport && (
          <button
            type="button"
            onClick={onExportReport}
            aria-label="Export report"
            title="Export report"
            className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <Bell className="h-4 w-4" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warning"
          />
        </button>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
            className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
