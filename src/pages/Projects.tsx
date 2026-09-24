import React, { useMemo, useState } from "react";
import { ArrowUpRight, FolderTree, Plus, Search, X } from "lucide-react";
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

type ProjectStatus = "all" | "healthy" | "degraded";

const statusFilters: Array<{
  id: ProjectStatus;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "healthy", label: "Healthy" },
  { id: "degraded", label: "Degraded" },
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenNewProject,
  onSelectProjectRequests,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>("all");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.slug.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [projects, normalizedSearch, statusFilter]);

  const hasActiveFilters = Boolean(normalizedSearch || statusFilter !== "all");

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <PageContainer>
      <header className="@container">
        <div className="flex min-w-0 flex-col gap-4 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-primary">
                Projects
              </h1>

              <Badge variant="neutral" fontFamily="mono">
                {projects.length} Total
              </Badge>
            </div>

            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-text-secondary">
              Active microservices, API gateways, and distributed workers.
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5 @2xl:w-auto @2xl:items-end">
            <div className="flex min-w-0 flex-col gap-2 @sm:flex-row @sm:items-center @2xl:justify-end">
              <div className="min-w-0 @sm:w-56">
                <Input
                  icon={<Search className="h-3.5 w-3.5" />}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="w-full"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={onOpenNewProject}
                className="w-full @sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>New Project</span>
              </Button>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <div
                className="flex min-w-0 max-w-full items-center gap-2 overflow-x-auto pb-0.5"
                aria-label="Project status filter"
              >
                {statusFilters.map((filter) => {
                  const isActive = statusFilter === filter.id;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setStatusFilter(filter.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "shrink-0 rounded-md border px-3 py-1.5 font-label-sm transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                        isActive
                          ? "border-accent bg-accent font-semibold text-white hover:bg-accent/90"
                          : "border-border-default bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                      )}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="shrink-0"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {filteredProjects.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const isHealthy = project.status === "healthy";
            const isElevatedErrorRate = project.errorRate > 0.5;

            return (
              <Card
                key={project.id}
                className="flex h-full min-w-0 flex-col p-4 transition-colors duration-150 hover:border-accent/50 sm:p-5"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-default bg-accent-soft text-accent">
                        <FolderTree
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-semibold leading-5 text-text-primary">
                          {project.name}
                        </h2>

                        <p className="mt-0.5 truncate font-code-inline text-text-secondary">
                          {project.slug}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={isHealthy ? "success" : "warning"}
                      fontFamily="mono"
                      className="shrink-0"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-current"
                        aria-hidden="true"
                      />
                      {isHealthy ? "Healthy" : "Degraded"}
                    </Badge>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-[12px] leading-5 text-text-secondary">
                    {project.description}
                  </p>

                  <dl className="mt-4 grid grid-cols-3 border-y border-border-default py-2.5">
                    <div className="min-w-0 pr-2">
                      <dt className="font-label-sm text-text-secondary">
                        Requests
                      </dt>
                      <dd className="mt-0.5 truncate font-code-inline font-semibold text-text-primary">
                        {(project.requestsTotal / 1000).toFixed(0)}k
                      </dd>
                    </div>

                    <div className="min-w-0 border-l border-border-default px-2">
                      <dt className="font-label-sm text-text-secondary">
                        Error rate
                      </dt>
                      <dd
                        className={cn(
                          "mt-0.5 truncate font-code-inline font-semibold",
                          isElevatedErrorRate ? "text-danger" : "text-success",
                        )}
                      >
                        {project.errorRate}%
                      </dd>
                    </div>

                    <div className="min-w-0 border-l border-border-default pl-2">
                      <dt className="font-label-sm text-text-secondary">
                        Latency
                      </dt>
                      <dd className="mt-0.5 truncate font-code-inline font-semibold text-text-primary">
                        {project.avgLatency}ms
                      </dd>
                    </div>
                  </dl>
                </div>

                <footer className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-border-default pt-3">
                  <span className="min-w-0 truncate font-code-inline text-[11px] text-text-secondary">
                    Deployed {project.lastDeployed}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectProjectRequests(project.name)}
                    className="shrink-0"
                  >
                    <span>View Telemetry</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </footer>
              </Card>
            );
          })}
        </div>
      ) : (
        <section className="border-y border-border-default bg-surface px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <FolderTree
              className="mx-auto h-5 w-5 text-text-secondary"
              aria-hidden="true"
            />

            <p className="mt-3 font-code-inline text-[12px] font-medium text-text-primary">
              No projects found.
            </p>

            <p className="mt-1 text-[12px] leading-5 text-text-secondary">
              Try changing the search query or project status filter.
            </p>

            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearFilters}
                className="mt-4"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        </section>
      )}
    </PageContainer>
  );
};
