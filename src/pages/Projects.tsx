import React, { useState } from "react";
import { Plus, Search, FolderTree, ArrowUpRight } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { Project } from "../types/project";
import { cn } from "../lib/utils";

export interface ProjectsPageProps {
  projects: Project[];
  onOpenNewProject: () => void;
  onSelectProjectRequests: (projectName: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenNewProject,
  onSelectProjectRequests,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "healthy" | "degraded"
  >("all");

  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      return (
        project.name.toLowerCase().includes(query) ||
        project.slug.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold leading-8 tracking-tight text-text-primary">
              Projects
            </h1>

            <span className="rounded border border-border-default bg-surface-muted px-2 py-0.5 font-label-sm text-text-secondary">
              {projects.length} Total
            </span>
          </div>

          <p className="mt-0.5 text-[13px] text-text-secondary">
            Active microservices, API gateways, and distributed workers.
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <div className="relative w-48 max-w-full">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="w-full pl-8"
              aria-label="Search projects"
            />
          </div>

          <Button variant="primary" size="sm" onClick={onOpenNewProject}>
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border-default pb-3">
        {(["all", "healthy", "degraded"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1 font-label-sm capitalize transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-border-default bg-surface text-text-secondary hover:bg-surface-muted",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-12 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="col-span-12 min-w-0 md:col-span-6 xl:col-span-4"
          >
            <Card className="flex h-full flex-col justify-between p-5 transition-colors hover:border-accent/50">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border-default bg-accent-soft text-accent">
                      <FolderTree className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-semibold leading-tight text-text-primary">
                        {project.name}
                      </h3>

                      <span className="block truncate font-code-inline text-text-secondary">
                        {project.slug}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      project.status === "healthy" ? "success" : "warning"
                    }
                    fontFamily="mono"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {project.status === "healthy" ? "Healthy" : "Degraded"}
                  </Badge>
                </div>

                <p className="mb-4 mt-2 line-clamp-2 text-[12px] text-text-secondary">
                  {project.description}
                </p>

                <div className="mb-4 grid grid-cols-3 gap-2 rounded-md border border-border-default bg-surface-muted px-3 py-2.5 font-mono text-[11px]">
                  <div className="min-w-0">
                    <span className="mb-0.5 block text-[10px] text-text-secondary">
                      REQUESTS
                    </span>

                    <span className="font-semibold text-text-primary">
                      {(project.requestsTotal / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="mb-0.5 block text-[10px] text-text-secondary">
                      ERROR RATE
                    </span>

                    <span
                      className={cn(
                        "font-semibold",
                        project.errorRate > 0.5
                          ? "text-danger"
                          : "text-success",
                      )}
                    >
                      {project.errorRate}%
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="mb-0.5 block text-[10px] text-text-secondary">
                      LATENCY
                    </span>

                    <span className="font-semibold text-text-primary">
                      {project.avgLatency}ms
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border-default pt-3 font-mono text-[11px] text-text-secondary">
                <span className="truncate">
                  Deployed {project.lastDeployed}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectProjectRequests(project.name)}
                  className="flex shrink-0 items-center gap-1 font-sans text-[11px] font-medium text-accent transition-colors hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span>View Telemetry</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
