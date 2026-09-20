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
  const [requests] = useState<ApiRequest[]>(mockRequests);
  const logs = mockLogs;

  // Selected request for the inspection drawer
  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(
    mockRequests[0] ?? null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Search & deep-linking filters
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

  const filteredRequests = requests.filter((request) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      request.endpoint.toLowerCase().includes(query) ||
      request.id.toLowerCase().includes(query) ||
      request.project.toLowerCase().includes(query) ||
      request.clientIp.toLowerCase().includes(query)
    );
  });

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={(page) => {
        setCurrentPage(page);

        if (page !== "logs") {
          setLogFilter("");
        }

        if (page !== "requests") {
          setRequestFilter("");
        }
      }}
      onOpenDrawer={() => {
        if (!selectedRequest) {
          setSelectedRequest(requests[0] ?? null);
        }

        setIsDrawerOpen(true);
      }}
      onOpenDocs={() => setIsDocsOpen(true)}
      onExportReport={() => setIsExportOpen(true)}
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
        requests={requests}
      />

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </AppShell>
  );
}
