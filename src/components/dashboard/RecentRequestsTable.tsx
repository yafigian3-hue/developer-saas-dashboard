import React, { useState, useMemo } from "react";
import { Filter, ArrowRight } from "lucide-react";
import type { ApiRequest } from "../../types/request";
import { MethodBadge, StatusBadge } from "../shared/StatusBadge";
import { Pagination } from "../ui/Pagination";
import { cn } from "../../lib/utils";

interface RecentRequestsTableProps {
  requests: ApiRequest[];
  selectedRequestId?: string;
  onSelectRequest: (request: ApiRequest) => void;
  filterPathInitial?: string;
}

export const RecentRequestsTable: React.FC<RecentRequestsTableProps> = ({
  requests,
  selectedRequestId,
  onSelectRequest,
  filterPathInitial = "",
}) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "2xx" | "4xx" | "5xx">("all");
  const [pathFilter, setPathFilter] = useState<string>(filterPathInitial);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Category filter
      if (activeFilter === "2xx" && req.statusCategory !== "2xx") return false;
      if (activeFilter === "4xx" && req.statusCategory !== "4xx") return false;
      if (activeFilter === "5xx" && req.statusCategory !== "5xx") return false;

      // Path / query search
      if (pathFilter.trim()) {
        const query = pathFilter.toLowerCase();
        const matchesPath = req.endpoint.toLowerCase().includes(query);
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesProject = req.project.toLowerCase().includes(query);
        return matchesPath || matchesId || matchesProject;
      }

      return true;
    });
  }, [requests, activeFilter, pathFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const displayTotal = 1842291; // Realistic simulated volume matching design

  return (
    <div className="bg-white rounded-lg border border-[#D9DDD7] shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Table Header / Toolbar */}
        <div className="p-5 border-b border-[#D9DDD7]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] text-[#181C1A] font-semibold tracking-tight">
                Recent Requests
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#265344] animate-ping" />
            </div>
            <p className="text-[12px] text-[#68716B] mt-0.5">
              Live telemetry stream across active gateway instances
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="inline-flex rounded-lg bg-[#F1F4F1] p-0.5 border border-[#C0C8C3]/50 text-[#68716B] font-label-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded transition-colors",
                  activeFilter === "all"
                    ? "bg-white text-[#181C1A] font-medium shadow-sm"
                    : "hover:text-[#181C1A]"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("2xx");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded transition-colors",
                  activeFilter === "2xx"
                    ? "bg-white text-[#181C1A] font-medium shadow-sm"
                    : "hover:text-[#181C1A]"
                )}
              >
                2xx OK
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("4xx");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded transition-colors",
                  activeFilter === "4xx"
                    ? "bg-white text-[#181C1A] font-medium shadow-sm"
                    : "hover:text-[#181C1A]"
                )}
              >
                4xx Warn
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("5xx");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded transition-colors",
                  activeFilter === "5xx"
                    ? "bg-white text-[#181C1A] font-medium shadow-sm"
                    : "hover:text-[#181C1A]"
                )}
              >
                5xx Err
              </button>
            </div>

            {/* Filter input */}
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#68716B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={pathFilter}
                onChange={(e) => {
                  setPathFilter(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter path..."
                className="h-7 w-32 md:w-44 pl-7 pr-2 font-code-inline text-[12px] bg-[#F1F4F1] border border-[#C0C8C3]/50 rounded focus:outline-none focus:border-[#265344] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#F0F1EE] border-b border-[#D9DDD7] text-[#68716B] font-label-sm uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Time (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">Method</th>
                <th className="py-2.5 px-3 font-semibold">Endpoint</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Latency</th>
                <th className="py-2.5 px-3 font-semibold">Project</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DDD7]/60 text-[12px]">
              {paginatedRequests.map((req) => {
                const isSelected = req.id === selectedRequestId;
                const isError = req.status >= 500;
                const isWarn = req.status >= 400 && req.status < 500;

                return (
                  <tr
                    key={req.id}
                    onClick={() => onSelectRequest(req)}
                    className={cn(
                      "transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#ECEFEB]/70 hover:bg-[#ECEFEB]"
                        : "hover:bg-[#F7FAF6]"
                    )}
                  >
                    <td className="py-2.5 px-4 font-code-inline text-[#181C1A] whitespace-nowrap">
                      {req.time}
                    </td>

                    <td className="py-2.5 px-3">
                      <MethodBadge method={req.method} />
                    </td>

                    <td className="py-2.5 px-3 font-code-inline text-[#181C1A] font-medium max-w-[200px] truncate">
                      {req.endpoint}
                    </td>

                    <td className="py-2.5 px-3">
                      <StatusBadge status={req.status} text={req.statusText} />
                    </td>

                    <td
                      className={cn(
                        "py-2.5 px-3 text-right font-code-inline whitespace-nowrap",
                        isError
                          ? "text-[#B84C45] font-semibold"
                          : isWarn
                          ? "text-[#B47A2C] font-medium"
                          : "text-[#68716B]"
                      )}
                    >
                      {req.latency.toLocaleString()}ms
                    </td>

                    <td className="py-2.5 px-3 text-[#68716B] whitespace-nowrap">
                      {req.project}
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequest(req);
                          }}
                          className="font-label-sm px-2 py-1 rounded bg-[#265344] text-white font-medium shadow-sm inline-flex items-center gap-1 ml-auto hover:bg-[#1f4538] transition-colors"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequest(req);
                          }}
                          className="font-label-sm px-2 py-1 rounded text-[#68716B] hover:text-[#181C1A] hover:bg-[#ECEFEB] transition-colors"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#68716B] font-mono text-[12px]">
                    No requests match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={displayTotal}
        startIndex={1 + (currentPage - 1) * itemsPerPage}
        endIndex={Math.min(currentPage * itemsPerPage, displayTotal)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};
