import React, { useRef, useEffect } from "react";
import {
  Search,
  Clock,
  Plus,
  Bell,
  Menu,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenNewProject: () => void;
  onOpenDrawer?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileSidebar,
  onOpenNewProject,
  onOpenDrawer,
  searchQuery,
  onSearchChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-14 bg-white border-b border-[#D9DDD7] z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 w-full max-w-xl">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-1.5 rounded-lg border border-[#D9DDD7] text-[#58605B] hover:bg-[#F0F1EE]"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Inspect Drawer Quick Trigger */}
        {onOpenDrawer && (
          <button
            type="button"
            onClick={onOpenDrawer}
            title="Open Inspect Drawer"
            className="p-1.5 rounded-md hover:bg-[#F1F4F1] text-[#58605B] transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#58605B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search endpoints, request IDs, IPs, or logs... (Press / to focus)"
            className="w-full h-8 pl-9 pr-8 bg-[#F1F4F1] border border-[#C0C8C3]/50 rounded-lg text-[12px] text-[#181C1A] placeholder:text-[#58605B] focus:outline-none focus:border-[#3F6B5B] focus:bg-white transition-all"
          />
          <kbd className="font-label-sm text-[#58605B] absolute right-2 top-1/2 -translate-y-1/2 px-1 rounded bg-[#E0E3E0] border border-[#C0C8C3]/50">
            /
          </kbd>
        </div>

        {/* Cluster / Region Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-[#ECEFEB] border border-[#C0C8C3]/50 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#265344]" />
          <span className="font-label-sm text-[#414945]">
            Production - us-east-1
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-2">
        {/* UTC Time Indicator */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F1F4F1] border border-[#C0C8C3]/50 text-[#58605B] font-label-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>UTC / 24h</span>
        </div>

        {/* New Project Action Button */}
        <button
          type="button"
          onClick={onOpenNewProject}
          className="h-8 px-2.5 sm:px-3 rounded-lg bg-[#265344] hover:bg-[#1f4538] text-white text-[12px] font-medium flex items-center gap-1.5 transition-colors shadow-none shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#58605B] hover:text-[#181C1A] hover:bg-[#E6E9E5] transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6B4100] border-2 border-white" />
        </div>

        <div className="hidden sm:block h-4 w-px bg-[#C0C8C3]/50" />

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-0.5 sm:pl-1">
          <div className="w-8 h-8 rounded-full bg-[#265344] flex items-center justify-center text-white font-medium text-xs shrink-0">
            TL
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[12px] text-[#181C1A] font-medium leading-none">
              Tech Lead
            </span>
            <span className="font-label-sm text-[#58605B] leading-tight mt-0.5">
              dev@acme.internal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
