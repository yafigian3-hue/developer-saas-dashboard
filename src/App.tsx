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
  const requests: ApiRequest[] = mockRequests;
  const logs = mockLogs;

  const [selectedRequest, setSelectedRequest] = useState<ApiRequest | null>(
    mockRequests[0] ?? null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState("");
  const [requestFilter, setRequestFilter] = useState("");

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    setIsDrawerOpen(false);

    if (page !== "logs") {
      setLogFilter("");
    }

    if (page !== "requests") {
      setRequestFilter("");
    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const handleOpenDrawer = () => {
    if (!selectedRequest) {
      setSelectedRequest(requests[0] ?? null);
    }

    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleViewLogsForRequest = (requestId: string) => {
    setIsDrawerOpen(false);
    setLogFilter(requestId);
    setCurrentPage("logs");
  };

  const handleSelectProjectRequests = (projectName: string) => {
    setRequestFilter(projectName);
    setCurrentPage("requests");
  };

  const handleCreateProject = (newProject: Partial<Project>) => {
    const project: Project = {
      id: `proj_${Date.now().toString(36)}`,
      name: newProject.name || "Untitled Microservice",
      slug: newProject.slug || "untitled-service",
      environment: newProject.environment || "production",
      description: newProject.description || "Microservice gateway endpoint.",
      status: "healthy",
      requestsTotal: 0,
      errorRate: 0,
      avgLatency: 35,
      healthProbesPassing: true,
      activeVersion: "v1.0.0",
      lastDeployed: "Just now",
    };

    setProjects((currentProjects) => [project, ...currentProjects]);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredRequests = normalizedSearch
    ? requests.filter((request) => {
        return (
          request.endpoint.toLowerCase().includes(normalizedSearch) ||
          request.id.toLowerCase().includes(normalizedSearch) ||
          request.project.toLowerCase().includes(normalizedSearch) ||
          request.clientIp.toLowerCase().includes(normalizedSearch)
        );
      })
    : requests;

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onOpenDrawer={handleOpenDrawer}
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
          onCloseDrawer={handleCloseDrawer}
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
          onCloseDrawer={handleCloseDrawer}
          onViewLogs={handleViewLogsForRequest}
          initialFilter={requestFilter}
          onExportReport={() => setIsExportOpen(true)}
        />
      )}

      {currentPage === "logs" && (
        <LogsPage logs={logs} initialSearch={logFilter} />
      )}

      {currentPage === "settings" && <SettingsPage />}

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
