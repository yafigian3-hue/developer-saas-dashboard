import { useEffect, useRef } from "react";
import type { FC } from "react";
import { Download, Menu, PanelRightOpen, Search, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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

  const hasContextualActions = Boolean(onOpenDrawer || onExportReport);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 min-w-0 items-center gap-2 border-b border-border-default bg-surface px-3 sm:gap-3 sm:px-4 lg:left-60 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenMobileSidebar}
        aria-label="Open navigation menu"
        className="shrink-0 lg:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </Button>

      <div className="min-w-0 flex-1">
        <Input
          ref={searchInputRef}
          icon={<Search className="h-3.5 w-3.5" />}
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search requests, endpoints, IDs, or IPs..."
          aria-label="Search requests"
          rightElement={
            <kbd className="pointer-events-none hidden rounded border border-border-default bg-surface px-1.5 py-0.5 font-code-inline text-[10px] leading-none text-text-secondary sm:block">
              /
            </kbd>
          }
          className="w-full"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {onOpenDrawer && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenDrawer}
            aria-label="Open inspect drawer"
            title="Inspect request"
            className="shrink-0"
          >
            <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}

        {onExportReport && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExportReport}
            aria-label="Export report"
            title="Export report"
            className="shrink-0"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}

        {hasContextualActions && (
          <div
            className="mx-1 h-4 w-px bg-border-default sm:mx-1.5"
            aria-hidden="true"
          />
        )}

        {onOpenSettings && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            aria-label="Open settings"
            title="Settings"
            className="shrink-0"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </header>
  );
};
