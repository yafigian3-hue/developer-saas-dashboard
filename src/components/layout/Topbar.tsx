import { useEffect, useRef, type FC } from "react";
import { Download, Menu, PanelRightOpen, Search, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TopbarProps {
  onOpenMobileSidebar: () => void;
  mobileSidebarOpen: boolean;
  onOpenDrawer?: () => void;
  onOpenSettings?: () => void;
  onExportReport?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const iconButton =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const ActionButton: FC<{
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ label, onClick, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={cn(iconButton, className)}
  >
    {children}
  </button>
);

export const Topbar: FC<TopbarProps> = ({
  onOpenMobileSidebar,
  mobileSidebarOpen,
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

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasActions = Boolean(onOpenDrawer || onExportReport || onOpenSettings);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 min-w-0 items-center gap-3 border-b border-border-default bg-surface/95 px-3 backdrop-blur-md sm:px-5 lg:left-60 lg:px-6">
      {/* Mobile navigation */}
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-controls="application-navigation"
        aria-expanded={mobileSidebarOpen}
        aria-label="Open navigation menu"
        className={cn(iconButton, "lg:hidden")}
      >
        <Menu size={19} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {/* Search */}
      <div className="min-w-0 flex-1 sm:max-w-[420px] lg:max-w-[480px]">
        <label
          htmlFor="global-search"
          className="group flex h-9 w-full items-center gap-2.5 rounded-lg border border-transparent bg-surface-muted px-3 transition-colors duration-150 hover:border-border-default focus-within:border-accent focus-within:bg-surface"
        >
          <Search
            size={16}
            strokeWidth={1.8}
            className="shrink-0 text-text-muted transition-colors group-focus-within:text-accent"
            aria-hidden="true"
          />

          <input
            ref={searchInputRef}
            id="global-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.blur();
              }
            }}
            placeholder="Search requests, endpoints, IDs..."
            aria-label="Search requests, endpoints, IDs, or IP addresses"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-muted sm:text-[13px] [&::-webkit-search-cancel-button]:cursor-pointer"
          />

          <kbd className="hidden shrink-0 rounded border border-border-default bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted sm:inline-flex">
            /
          </kbd>
        </label>
      </div>

      {/* Actions */}
      {hasActions && (
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {onOpenDrawer && (
            <ActionButton label="Inspect request" onClick={onOpenDrawer}>
              <PanelRightOpen size={17} strokeWidth={1.8} aria-hidden="true" />
            </ActionButton>
          )}

          {onExportReport && (
            <ActionButton label="Export report" onClick={onExportReport}>
              <Download size={17} strokeWidth={1.8} aria-hidden="true" />
            </ActionButton>
          )}

          {onOpenSettings && (
            <>
              <div
                className="mx-1 h-5 w-px bg-border-default"
                aria-hidden="true"
              />

              <ActionButton label="Open settings" onClick={onOpenSettings}>
                <Settings size={17} strokeWidth={1.8} aria-hidden="true" />
              </ActionButton>
            </>
          )}
        </div>
      )}
    </header>
  );
};
