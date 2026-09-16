import React, { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import type { NavPage } from "./components/layout/Sidebar";
import { OverviewPage } from "./pages/Overview";
import { ProjectsPage } from "./pages/Projects";
import { RequestsPage } from "./pages/Requests";
import { LogsPage } from "./pages/Logs";
import { SettingsPage } from "./pages/Settings";
import { NewProjectModal } from "./components/dashboard/NewProjectModal";
import { ExportModal } from "./components/dashboard/ExportModal";
import { DocsModal } from "./components/dashboard/DocsModal";
import { mockRequests } from "./data/requests";
import { mockProjects } from "./data/projects";
import { mockLogs } from "./data/logs";
import type { ApiRequest } from "./types/request";
import type { Project } from "./types/project";

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>("overview");
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [requests, setRequests] = useState<ApiRequest[]>(mockRequests);
  const [logs, setLogs] = useState(mockLogs);

  // Selected request for the inspection drawer (default to checkout 500 error as shown in design)
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(
    mockRequests[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Modals
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Search & Deep-linking filters
  const [searchQuery, setSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState("");
  const [requestFilter, setRequestFilter] = useState("");

  const handleSelectRequest = (req: ApiRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleViewLogsForRequest = (reqId: string) => {
    setIsDrawerOpen(false);
    setLogFilter(reqId);
    setCurrentPage("logs");
  };

  const handleSelectProjectRequests = (projectName: string) => {
    setRequestFilter(projectName);
    setCurrentPage("requests");
  };

  const handleCreateProject = (newProj: Partial<Project>) => {
    const project: Project = {
      id: `proj_${Date.now().toString(36)}`,
      name: newProj.name || "Untitled Microservice",
      slug: newProj.slug || "untitled-service",
      environment: newProj.environment || "production",
      description: newProj.description || "Microservice gateway endpoint.",
      status: "healthy",
      requestsTotal: 0,
      errorRate: 0.0,
      avgLatency: 35,
      healthProbesPassing: true,
      activeVersion: "v1.0.0",
      lastDeployed: "Just now",
    };
    setProjects((prev) => [project, ...prev]);
  };

  // Filter requests when global search is used
  const filteredRequests = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.endpoint.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q) ||
      r.clientIp.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={(page) => {
        setCurrentPage(page);
        if (page !== "logs") setLogFilter("");
        if (page !== "requests") setRequestFilter("");
      }}
      onOpenNewProject={() => setIsNewProjectOpen(true)}
      onOpenDrawer={() => {
        if (!selectedRequest) setSelectedRequest(requests[0]);
        setIsDrawerOpen(true);
      }}
      onOpenDocs={() => setIsDocsOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {currentPage === "overview" && (
        <OverviewPage
          requests={filteredRequests}
          selectedRequest={selectedRequest}
          onSelectRequest={handleSelectRequest}
          isDrawerOpen={isDrawerOpen}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          onViewLogs={handleViewLogsForRequest}
          onExportReport={() => setIsExportOpen(true)}
        />
      )}

      {currentPage === "projects" && (
        <ProjectsPage
          projects={projects}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onSelectProjectRequests={handleSelectProjectRequests}
        />
      )}

      {currentPage === "requests" && (
        <RequestsPage
          requests={filteredRequests}
          selectedRequest={selectedRequest}
          onSelectRequest={handleSelectRequest}
          isDrawerOpen={isDrawerOpen}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          onViewLogs={handleViewLogsForRequest}
          initialFilter={requestFilter}
        />
      )}

      {currentPage === "logs" && (
        <LogsPage logs={logs} initialSearch={logFilter} />
      )}

      {currentPage === "settings" && <SettingsPage />}

      {/* Global Modals */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </AppShell>
  );
}
