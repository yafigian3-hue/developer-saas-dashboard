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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-canvas text-text-primary antialiased">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenDocs={onOpenDocs}
      />

      <div className="min-h-screen w-full min-w-0 lg:pl-60">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenDrawer={onOpenDrawer}
          onOpenSettings={() => onNavigate("settings")}
          onExportReport={onExportReport}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="min-h-screen w-full min-w-0 overflow-x-hidden bg-canvas pt-14">
          {children}
        </main>
      </div>
    </div>
  );
};
