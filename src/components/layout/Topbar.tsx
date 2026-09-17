import { useEffect, useRef } from "react";
import type { FC } from "react";
import {
  Bell,
  Download,
  Menu,
  PanelRightOpen,
  Search,
  Settings,
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasContextualActions = Boolean(onOpenDrawer || onExportReport);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-border-default bg-surface px-4 sm:px-6 lg:left-60">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label="Open navigation menu"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative min-w-0 max-w-2xl flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search endpoints, request IDs, IPs, or logs..."
          aria-label="Search dashboard"
          className="h-8 w-full rounded-md border border-border-default bg-surface-muted pl-9 pr-9 text-xs text-text-primary placeholder:text-text-secondary transition-colors duration-150 focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border-default bg-surface px-1.5 py-0.5 font-mono text-[10px] leading-none text-text-secondary sm:block">
          /
        </kbd>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {onOpenDrawer && (
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open inspect drawer"
            title="Open inspect drawer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        )}

        {onExportReport && (
          <button
            type="button"
            onClick={onExportReport}
            aria-label="Export report"
            title="Export report"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {hasContextualActions && (
          <div className="mx-1 h-4 w-px bg-border-default" aria-hidden="true" />
        )}

        {/* Global actions — always available regardless of page */}
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
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
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
