import React, { useState } from "react";
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

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col text-[#181C1A] antialiased">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenNewProject={onOpenNewProject}
        onOpenDocs={onOpenDocs}
      />

      {/* Main View Area Offset by Sidebar width on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenNewProject={onOpenNewProject}
          onOpenDrawer={onOpenDrawer}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Main Content Area */}
        <main className="w-full pt-14 flex-1 bg-[#F7FAF6]">
          {children}
        </main>
      </div>
    </div>
  );
};
