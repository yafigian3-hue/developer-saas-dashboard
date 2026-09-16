import React, { useState } from "react";
import { Plus, Search, FolderTree, ArrowUpRight, Activity } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
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
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "degraded">("all");

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] leading-8 font-semibold text-[#181C1A] tracking-tight">
              Projects
            </h1>
            <span className="font-label-sm bg-[#ECEFEB] text-[#58605B] px-2 py-0.5 rounded border border-[#C0C8C3]/50">
              {projects.length} Total
            </span>
          </div>
          <p className="text-[13px] text-[#68716B] mt-0.5">
            Active microservices, API gateways, and distributed workers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#68716B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="h-8 w-48 pl-8 pr-3 text-[12px] bg-white border border-[#D9DDD7] rounded-lg focus:outline-none focus:border-[#265344]"
            />
          </div>

          <Button variant="primary" size="sm" onClick={onOpenNewProject}>
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9DDD7] pb-3">
        {(["all", "healthy", "degraded"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-3 py-1 text-label-sm rounded-md capitalize transition-colors",
              statusFilter === status
                ? "bg-[#265344] text-white font-medium"
                : "bg-white text-[#68716B] border border-[#D9DDD7] hover:bg-[#F0F1EE]"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid: 12-col grid */}
      <div className="grid grid-cols-12 gap-6">
        {filteredProjects.map((project) => {
          return (
            <div
              key={project.id}
              className="col-span-12 md:col-span-6 xl:col-span-4 min-w-0"
            >
              <Card className="hover:border-[#265344]/50 transition-colors flex flex-col justify-between h-full p-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#F1F4F1] border border-[#D9DDD7] flex items-center justify-center text-[#265344]">
                        <FolderTree className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-[#181C1A] leading-tight">
                          {project.name}
                        </h3>
                        <span className="font-code-inline text-[11px] text-[#68716B]">
                          {project.slug}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={project.status === "healthy" ? "success" : "warning"}
                      fontFamily="mono"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {project.status === "healthy" ? "Healthy" : "Degraded"}
                    </Badge>
                  </div>

                  <p className="text-[12px] text-[#68716B] mt-2 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F1F4F1]/60 rounded-md border border-[#D9DDD7]/60 mb-4 font-mono text-[11px]">
                    <div>
                      <span className="text-[#68716B] block text-[10px]">REQUESTS</span>
                      <span className="font-semibold text-[#181C1A]">
                        {(project.requestsTotal / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div>
                      <span className="text-[#68716B] block text-[10px]">ERROR RATE</span>
                      <span
                        className={cn(
                          "font-semibold",
                          project.errorRate > 0.5 ? "text-[#B84C45]" : "text-[#3F765C]"
                        )}
                      >
                        {project.errorRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#68716B] block text-[10px]">LATENCY</span>
                      <span className="font-semibold text-[#181C1A]">
                        {project.avgLatency}ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9DDD7]/60 flex items-center justify-between text-[11px] font-mono text-[#68716B]">
                  <span>Deployed {project.lastDeployed}</span>
                  <button
                    type="button"
                    onClick={() => onSelectProjectRequests(project.name)}
                    className="text-[#265344] hover:underline font-sans font-medium flex items-center gap-1"
                  >
                    <span>View Telemetry</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
