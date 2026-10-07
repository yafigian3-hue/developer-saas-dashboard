import { useEffect, type FC } from "react";
import {
  LayoutDashboard,
  Layers,
  ArrowLeftRight,
  Terminal,
  Settings,
  BookOpen,
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
  /** Opsional. Contoh: "99.98%". Jika kosong, angka tidak ditampilkan. */
  uptime?: string;
  /** Opsional. Jika diisi, status menjadi tombol menuju halaman status. */
  onOpenStatus?: () => void;
}

const navItems: SidebarNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "requests", label: "Requests", icon: ArrowLeftRight },
  { id: "logs", label: "Logs", icon: Terminal },
  { id: "settings", label: "Settings", icon: Settings },
];

/* Satu sumber untuk fokus & hover agar konsisten di semua item. */
const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent";

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
        "relative flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[14.5px] transition-colors duration-150",
        "lg:h-9 lg:px-2.5 lg:text-[13.5px]",
        focusRing,
        isActive
          ? "bg-surface-muted font-medium text-text-primary"
          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
        /* Indikator kiri: menempel ke tepi sidebar (nav memakai px-3). */
        isActive &&
          "before:absolute before:-left-3 before:inset-y-2.5 before:w-0.5 before:rounded-r-sm before:bg-accent before:content-[''] lg:before:inset-y-[7px]",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-accent" : "text-current",
        )}
        strokeWidth={isActive ? 2 : 1.75}
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
  /* Tutup drawer dengan Escape. */
  useEffect(() => {
    if (!isOpenMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseMobile?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpenMobile, onCloseMobile]);

  const handleNavigate = (page: NavPage) => {
    onNavigate(page);
    onCloseMobile?.();
  };

  const handleOpenDocs = () => {
    onOpenDocs?.();
    onCloseMobile?.();
  };

  const statusContent = (
    <>
      <span className="mx-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
      <span>Operational</span>
      {uptime && (
        <span className="ml-auto font-mono text-[11.5px] text-text-secondary/70">
          {uptime}
        </span>
      )}
    </>
  );

  const statusClass =
    "flex h-11 w-full items-center gap-2.5 rounded-md px-3 text-[12.5px] text-text-secondary lg:h-9 lg:px-2.5";

  return (
    <>
      {isOpenMobile && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 cursor-default bg-text-primary/40 lg:hidden"
        />
      )}

      <aside
        aria-label="Application navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(17.5rem,84vw)] flex-col border-r border-border-default bg-surface",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:w-60 lg:pt-0 lg:pb-0",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-default pl-5 pr-3">
          <div
            className="flex min-w-0 items-baseline text-[13px] leading-none tracking-[0.14em]"
            aria-label="Dev Console"
          >
            <span className="font-bold text-text-primary">DEV</span>
            <span className="ml-[0.5em] font-normal text-text-secondary">
              CONSOLE
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className={cn(
              "-mr-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary lg:hidden",
              focusRing,
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigasi */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-4 lg:pt-5">
          <nav
            aria-label="Primary navigation"
            className="flex flex-col gap-0.5"
          >
            {navItems.map((item) => (
              <SidebarNavButton
                key={item.id}
                item={item}
                isActive={currentPage === item.id}
                onClick={() => handleNavigate(item.id)}
              />
            ))}
          </nav>

          {onOpenDocs && (
            <div className="mt-6 lg:mt-8">
              <p
                id="sidebar-resources-label"
                className="mb-1.5 px-3 text-[11.5px] font-medium tracking-[0.02em] text-text-secondary/70 lg:px-2.5"
              >
                Resources
              </p>
              <button
                type="button"
                onClick={handleOpenDocs}
                className={cn(
                  "flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[14px] text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary",
                  "lg:h-8 lg:px-2.5 lg:text-[13px]",
                  focusRing,
                )}
              >
                <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">Documentation</span>
              </button>
            </div>
          )}
        </div>

        {/* Status sistem */}
        <div className="shrink-0 border-t border-border-default px-3 py-1.5">
          {onOpenStatus ? (
            <button
              type="button"
              onClick={onOpenStatus}
              aria-label={`Status sistem: operasional${uptime ? `, uptime ${uptime}` : ""}`}
              className={cn(
                statusClass,
                "transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary",
                focusRing,
              )}
            >
              {statusContent}
            </button>
          ) : (
            <div className={statusClass} role="status">
              {statusContent}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};