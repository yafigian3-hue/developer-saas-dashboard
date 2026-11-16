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

const statusFilters: Array<{ id: ProjectStatus; label: string }> = [
  { id: "all", label: "All projects" },
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

      if (!normalizedSearch) return true;

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
      <div className="@container space-y-6">
        {/* Page Header */}
        <header className="flex min-w-0 flex-col gap-5 @2xl:flex-row @2xl:items-end @2xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-[28px]">
                Projects
              </h1>

              <Badge variant="neutral" fontFamily="mono">
                {projects.length} Total
              </Badge>
            </div>

            <p className="mt-2 max-w-xl text-[13px] leading-5 text-text-secondary">
              Monitor your services, API gateways, and distributed workers from
              one workspace.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 @2xl:w-auto @2xl:min-w-[340px]">
            <div className="flex min-w-0 flex-col gap-2 @sm:flex-row">
              <div className="min-w-0 flex-1">
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
                className="w-full shrink-0 @sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>New Project</span>
              </Button>
            </div>

            <div className="flex min-w-0 items-center justify-between gap-2">
              <div
                className="grid min-w-0 flex-1 grid-cols-3 gap-1 rounded-lg border border-border-default bg-surface-muted/70 p-1"
                role="group"
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
                        "min-w-0 rounded-md px-1.5 py-1.5 text-[10px] font-medium transition-all duration-150 sm:px-2.5 sm:text-xs",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                        isActive
                          ? "bg-surface text-text-primary shadow-sm"
                          : "text-text-secondary hover:text-text-primary",
                      )}
                    >
                      <span className="block truncate">{filter.label}</span>
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
                  <span className="hidden @sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Project Results */}
        {filteredProjects.length > 0 ? (
          <>
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <p className="text-xs font-medium text-text-secondary">
                Showing{" "}
                <span className="font-semibold tabular-nums text-text-primary">
                  {filteredProjects.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold tabular-nums text-text-primary">
                  {projects.length}
                </span>{" "}
                projects
              </p>

              {hasActiveFilters && (
                <span className="text-[11px] text-text-secondary">
                  Filtered results
                </span>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => {
                const isHealthy = project.status === "healthy";
                const isElevatedErrorRate = project.errorRate > 0.5;

                return (
                  <Card
                    key={project.id}
                    className="group flex h-full min-w-0 flex-col rounded-xl border border-border-default bg-surface p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      {/* Project Identity */}
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/15 bg-accent-soft text-accent">
                            <FolderTree
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold tracking-tight text-text-primary">
                              {project.name}
                            </h2>
                            <p className="mt-0.5 truncate font-mono text-[10px] text-text-secondary sm:text-[11px]">
                              {project.slug}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant={isHealthy ? "success" : "warning"}
                          fontFamily="sans"
                          className="shrink-0"
                        >
                          <span
                            className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
                            aria-hidden="true"
                          />
                          {isHealthy ? "Healthy" : "Degraded"}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="mt-4 line-clamp-2 min-h-10 text-[12px] leading-5 text-text-secondary">
                        {project.description}
                      </p>

                      {/* Project Metrics */}
                      <dl className="mt-4 grid grid-cols-3 border-y border-border-default py-3">
                        <div className="min-w-0 pr-2">
                          <dt className="text-[10px] font-medium text-text-secondary sm:text-[11px]">
                            Requests
                          </dt>
                          <dd className="mt-1 truncate font-mono text-[13px] font-semibold tabular-nums tracking-tight text-text-primary sm:text-sm">
                            {(project.requestsTotal / 1000).toFixed(0)}k
                          </dd>
                        </div>

                        <div className="min-w-0 border-l border-border-default px-2">
                          <dt className="text-[10px] font-medium text-text-secondary sm:text-[11px]">
                            Error rate
                          </dt>
                          <dd
                            className={cn(
                              "mt-1 truncate font-mono text-[13px] font-semibold tabular-nums tracking-tight sm:text-sm",
                              isElevatedErrorRate
                                ? "text-danger"
                                : "text-success",
                            )}
                          >
                            {project.errorRate}%
                          </dd>
                        </div>

                        <div className="min-w-0 border-l border-border-default pl-2">
                          <dt className="text-[10px] font-medium text-text-secondary sm:text-[11px]">
                            Latency
                          </dt>
                          <dd className="mt-1 truncate font-mono text-[13px] font-semibold tabular-nums tracking-tight text-text-primary sm:text-sm">
                            {project.avgLatency}ms
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Card Footer */}
                    <footer className="mt-3 flex min-w-0 items-center justify-between gap-2 pt-1">
                      <span className="min-w-0 truncate text-[10px] text-text-secondary sm:text-[11px]">
                        Deployed{" "}
                        <span className="font-mono text-text-primary">
                          {project.lastDeployed}
                        </span>
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectProjectRequests(project.name)}
                        className="shrink-0 gap-1.5 px-2"
                      >
                        <span>Telemetry</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </Button>
                    </footer>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <section className="rounded-xl border border-dashed border-border-default bg-surface px-4 py-14 sm:px-6">
            <div className="mx-auto max-w-sm text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-surface-muted text-text-secondary">
                <FolderTree className="h-4 w-4" aria-hidden="true" />
              </div>

              <h2 className="mt-4 text-sm font-semibold tracking-tight text-text-primary">
                No projects found
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                Try adjusting your search query or selecting a different project
                status.
              </p>

              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Clear filters</span>
                </Button>
              )}
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
};
