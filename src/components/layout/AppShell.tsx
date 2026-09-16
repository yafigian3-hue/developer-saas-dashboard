import React, { useEffect, useState } from "react";
import { Sidebar, type NavPage } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface AppShellProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: React.ReactNode;
  onOpenNewProject: () => void;
  onOpenDrawer?: () => void;
  onOpenDocs?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  children,
  onOpenNewProject,
  onOpenDrawer,
  onOpenDocs,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const lockScroll = mobileSidebarOpen && window.innerWidth < 1024;

    document.documentElement.style.overflow = lockScroll ? "hidden" : "";
    document.body.style.overflow = lockScroll ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-canvas text-text-primary antialiased">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenDocs={onOpenDocs}
      />

      <div className="min-h-screen w-full min-w-0 lg:pl-64">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenNewProject={onOpenNewProject}
          onOpenDrawer={onOpenDrawer}
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
