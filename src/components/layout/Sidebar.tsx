import type { FC } from "react";
import {
  LayoutDashboard,
  Layers,
  ArrowLeftRight,
  Terminal,
  Settings,
  BookOpen,
  X,
  Radio,
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
  live?: boolean;
}

export interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenDocs?: () => void;
}

const navItems: SidebarNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "projects",
    label: "Projects",
    icon: Layers,
  },
  {
    id: "requests",
    label: "Requests",
    icon: ArrowLeftRight,
    live: true,
  },
  {
    id: "logs",
    label: "Logs",
    icon: Terminal,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

const SidebarNavButton: FC<{
  item: SidebarNavItem;
  isActive: boolean;
  onClick: () => void;
  onCloseMobile?: () => void;
}> = ({ item, isActive, onClick, onCloseMobile }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        onCloseMobile?.();
      }}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded px-2.5 text-left text-[13px] transition-colors duration-150",
        isActive
          ? "bg-accent-soft text-accent font-medium"
          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </span>

      {item.live && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
          aria-label="Live"
          title="Live"
        />
      )}
    </button>
  );
};

export const Sidebar: FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onOpenDocs,
}) => {
  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border-default bg-surface transition-transform duration-200 ease-out",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent text-white">
              <Radio className="h-4 w-4" />
            </div>

            <span className="truncate text-[14px] font-semibold tracking-tight text-text-primary">
              Developer SaaS
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3">
          <nav aria-label="Primary navigation" className="space-y-0.5">
            {navItems.map((item) => (
              <SidebarNavButton
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => onNavigate(item.id)}
                onCloseMobile={onCloseMobile}
              />
            ))}
          </nav>
        </div>

        {/* Footer Utilities */}
        <div className="shrink-0 border-t border-border-default px-2.5 py-3">
          <div className="space-y-0.5">
            {onOpenDocs && (
              <button
                type="button"
                onClick={onOpenDocs}
                className="flex h-9 w-full items-center gap-2.5 rounded px-2.5 text-left text-[13px] text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Documentation</span>
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-text-secondary">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            <span>Systems normal</span>
          </div>
        </div>
      </aside>
    </>
  );
};
