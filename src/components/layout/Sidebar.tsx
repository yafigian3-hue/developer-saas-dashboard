import React from "react";
import {
  LayoutDashboard,
  Layers,
  ArrowLeftRight,
  Terminal,
  Settings,
  Key,
  LineChart,
  FolderTree,
  ChevronsUpDown,
  BookOpen,
  X,
  Radio,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type NavPage = "overview" | "projects" | "requests" | "logs" | "settings";

export interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenNewProject?: () => void;
  onOpenDocs?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  onOpenDocs,
}) => {
  const navItems: Array<{
    id: NavPage;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeVariant?: "neutral" | "live";
  }> = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <Layers className="w-[18px] h-[18px]" />,
      badge: "12",
      badgeVariant: "neutral",
    },
    {
      id: "requests",
      label: "Requests",
      icon: <ArrowLeftRight className="w-[18px] h-[18px]" />,
      badge: "Live",
      badgeVariant: "live",
    },
    {
      id: "logs",
      label: "Logs",
      icon: <Terminal className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-[1px]"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#D9DDD7] z-40 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Workspace Brand Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#D9DDD7]/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#265344] flex items-center justify-center text-white shadow-sm shrink-0">
                <Radio className="w-4 h-4 text-[#BAEAD5]" />
              </div>
              <span className="font-semibold text-[16px] text-[#181C1A] tracking-tight">
                Developer SaaS
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-[#414945] bg-[#ECEFEB] px-1.5 py-0.5 rounded border border-[#C0C8C3]/50">
                v1.0
              </span>
              {/* Close button on mobile */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded hover:bg-[#F0F1EE] text-[#68716B]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project Selector Pill */}
          <div className="p-3 border-b border-[#D9DDD7]/60 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#F1F4F1] hover:bg-[#ECEFEB] border border-[#C0C8C3]/50 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FolderTree className="w-4 h-4 text-[#58605B] shrink-0" />
                <span className="text-[12px] text-[#181C1A] font-medium truncate">
                  All Projects
                </span>
                <span className="font-label-sm bg-[#E6E9E5] text-[#414945] px-1.5 py-0.5 rounded-full">
                  12
                </span>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-[#58605B] shrink-0" />
            </button>
          </div>

          {/* Section: Overview Navigation */}
          <div className="px-3 py-3">
            <div className="font-label-sm text-[#58605B] uppercase tracking-wider px-2.5 mb-1.5 font-semibold">
              Overview
            </div>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left",
                      isActive
                        ? "bg-[#DCE5DD] text-[#265344] font-medium border-l-2 border-[#265344] pl-2"
                        : "text-[#414945] hover:bg-[#E6E9E5] hover:text-[#181C1A]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-[12px]">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "font-label-sm px-1.5 py-0.5 rounded",
                          item.badgeVariant === "live"
                            ? "bg-[#3F6B5B]/20 text-[#265344] border border-[#265344]/30 font-medium"
                            : "bg-[#ECEFEB] text-[#414945]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Configuration */}
          <div className="px-3 py-1.5">
            <div className="font-label-sm text-[#58605B] uppercase tracking-wider px-2.5 mb-1.5 font-semibold">
              Configuration
            </div>
            <nav className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onNavigate("settings");
                  if (onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left",
                  currentPage === "settings"
                    ? "bg-[#DCE5DD] text-[#265344] font-medium border-l-2 border-[#265344] pl-2"
                    : "text-[#414945] hover:bg-[#E6E9E5] hover:text-[#181C1A]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-[18px] h-[18px]" />
                  <span className="text-[12px]">Settings</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Section: Backlog */}
          <div className="px-3 py-1.5 opacity-60">
            <div className="font-label-sm text-[#58605B] uppercase tracking-wider px-2.5 mb-1.5 font-semibold flex items-center justify-between">
              <span>Backlog</span>
              <span className="font-label-sm bg-[#ECEFEB] text-[#58605B] px-1 rounded">
                Soon
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-[#58605B] cursor-not-allowed">
                <Key className="w-[18px] h-[18px]" />
                <span className="text-[12px]">API Keys</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-[#58605B] cursor-not-allowed">
                <LineChart className="w-[18px] h-[18px]" />
                <span className="text-[12px]">Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Status & Docs */}
        <div className="p-3 border-t border-[#D9DDD7]/80 space-y-2 bg-white shrink-0">
          <div className="flex items-center justify-between px-2 py-1 bg-[#F1F4F1] rounded border border-[#D9DDD7]/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#265344] animate-pulse" />
              <span className="font-label-sm text-[#181C1A] font-medium">
                Systems Normal
              </span>
            </div>
            <span className="font-label-sm text-[#58605B]">99.98%</span>
          </div>

          <div className="flex items-center justify-between px-2 pt-1">
            <button
              type="button"
              onClick={onOpenDocs}
              className="flex items-center gap-1.5 text-[12px] text-[#58605B] hover:text-[#181C1A] transition-colors"
            >
              <BookOpen className="w-[15px] h-[15px]" />
              <span>Documentation</span>
            </button>
            <span className="font-label-sm bg-[#ECEFEB] text-[#58605B] px-1.5 py-0.5 rounded border border-[#D9DDD7]/60">
              Cmd+K
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
