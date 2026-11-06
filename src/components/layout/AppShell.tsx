import React, { useState } from "react";
import { Sidebar, type NavPage } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useLockBodyScroll } from "../../lib/useLockBodyScroll";

export interface AppShellProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: React.ReactNode;
  onOpenDrawer?: () => void;
  onOpenDocs?: () => void;
  onExportReport?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  children,
  onOpenDrawer,
  onOpenDocs,
  onExportReport,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useLockBodyScroll(mobileSidebarOpen);

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const handleOpenMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleNavigate = (page: NavPage) => {
    onNavigate(page);
    handleCloseMobileSidebar();
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-canvas text-text-primary antialiased">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-surface px-4 py-3 text-sm font-medium text-text-primary shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={handleCloseMobileSidebar}
        onOpenDocs={onOpenDocs}
      />

      <div className="min-h-screen min-w-0 lg:pl-60">
        <Topbar
          onOpenMobileSidebar={handleOpenMobileSidebar}
          mobileSidebarOpen={mobileSidebarOpen}
          onOpenDrawer={onOpenDrawer}
          onOpenSettings={() => handleNavigate("settings")}
          onExportReport={onExportReport}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-screen min-w-0 overflow-x-hidden bg-canvas pt-14 outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
