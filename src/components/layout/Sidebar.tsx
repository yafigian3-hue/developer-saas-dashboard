
import { useEffect, useState, type FC } from "react";
import {
  Activity,
  ArrowLeftRight,
  BookOpen,
  Code2,
  Layers,
  LayoutDashboard,
  Settings,
  Terminal,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type NavPage =
  | "overview"
  | "projects"
  | "requests"
  | "logs"
  | "settings";

interface SidebarNavItem {
  id: NavPage;
  label: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenDocs?: () => void;
  uptime?: string;
  onOpenStatus?: () => void;
}

const navItems: SidebarNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "requests", label: "Requests", icon: ArrowLeftRight },
  { id: "logs", label: "Logs", icon: Terminal },
  { id: "settings", label: "Settings", icon: Settings },
];

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const SidebarNavButton: FC<{
  item: SidebarNavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors duration-150",
        focusRing,
        isActive
          ? "bg-accent-soft font-semibold text-accent"
          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
      )}
    >
      {isActive && (
        <span
          className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-accent"
          aria-hidden="true"
        />
      )}

      <Icon
        size={17}
        strokeWidth={isActive ? 2.1 : 1.75}
        className={cn(
          "shrink-0 transition-colors duration-150",
          isActive
            ? "text-accent"
            : "text-text-muted group-hover:text-text-primary",
        )}
        aria-hidden="true"
      />

      <span className="truncate">{item.label}</span>
    </button>
  );
};

export const Sidebar: FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onOpenDocs,
  uptime,
  onOpenStatus,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  const isHiddenOnMobile = !isDesktop && !isOpenMobile;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 64rem)");

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isOpenMobile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMobile?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpenMobile, onCloseMobile]);

  const handleNavigate = (page: NavPage) => {
    onNavigate(page);
    onCloseMobile?.();
  };

  const handleOpenDocs = () => {
    onOpenDocs?.();
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 cursor-default bg-text-primary/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id="application-navigation"
        aria-label="Application navigation"
        aria-hidden={isHiddenOnMobile}
        inert={isHiddenOnMobile}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] flex-col border-r border-border-default bg-surface",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:w-60 lg:pt-0 lg:pb-0",
          isOpenMobile
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
              <Code2 size={17} strokeWidth={2.2} aria-hidden="true" />
            </div>

            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[13px] font-bold leading-none tracking-[0.08em] text-text-primary">
                DEV CONSOLE
              </span>
              <span className="text-[9px] font-medium leading-none tracking-[0.12em] text-text-muted">
                ENGINEERING WORKSPACE
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary lg:hidden",
              focusRing,
            )}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-5 pt-6">
          <nav aria-label="Primary navigation">
            <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
              Workspace
            </p>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <SidebarNavButton
                  key={item.id}
                  item={item}
                  isActive={currentPage === item.id}
                  onClick={() => handleNavigate(item.id)}
                />
              ))}
            </div>
          </nav>

          {onOpenDocs && (
            <div className="mt-9">
              <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
                Resources
              </p>

              <button
                type="button"
                onClick={handleOpenDocs}
                className={cn(
                  "group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary",
                  focusRing,
                )}
              >
                <BookOpen
                  size={17}
                  strokeWidth={1.75}
                  className="shrink-0 text-text-muted transition-colors group-hover:text-text-primary"
                  aria-hidden="true"
                />

                <span>Documentation</span>
              </button>
            </div>
          )}
        </div>

        {/* System status */}
        <div className="shrink-0 border-t border-border-default p-3">
          {onOpenStatus ? (
            <button
              type="button"
              onClick={onOpenStatus}
              aria-label={`System status: operational${uptime ? `, uptime ${uptime}` : ""}`}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-surface-muted",
                focusRing,
              )}
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-25" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[12px] font-medium text-text-primary">
                  All systems operational
                </span>
                {uptime && (
                  <span className="font-mono text-[10px] text-text-muted">
                    Uptime {uptime}
                  </span>
                )}
              </span>

              <Activity
                size={15}
                className="shrink-0 text-success"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div
              className="flex min-h-11 items-center gap-3 rounded-lg px-3"
              role="status"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-25" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[12px] font-medium text-text-primary">
                  All systems operational
                </span>
                {uptime && (
                  <span className="font-mono text-[10px] text-text-muted">
                    Uptime {uptime}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
  