import React, { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import type { ApiRequest } from "../../types/request";
import { MethodBadge, StatusBadge } from "../shared/StatusBadge";
import { Pagination } from "../ui/Pagination";
import { Input } from "../ui/Input";
import { cn } from "../../lib/utils";

interface RecentRequestsTableProps {
  requests: ApiRequest[];
  selectedRequestId?: string;
  onSelectRequest: (request: ApiRequest) => void;
  filterPathInitial?: string;
}

type StatusFilter = "all" | "2xx" | "4xx" | "5xx";

const ITEMS_PER_PAGE = 6;

const statusFilters: Array<{
  id: StatusFilter;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "2xx", label: "2xx OK" },
  { id: "4xx", label: "4xx Warn" },
  { id: "5xx", label: "5xx Err" },
];

export const RecentRequestsTable: React.FC<RecentRequestsTableProps> = ({
  requests,
  selectedRequestId,
  onSelectRequest,
  filterPathInitial = "",
}) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [pathFilter, setPathFilter] = useState(filterPathInitial);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setPathFilter(filterPathInitial);
    setCurrentPage(1);
  }, [filterPathInitial]);

  const filteredRequests = useMemo(() => {
    const query = pathFilter.trim().toLowerCase();

    return requests.filter((request) => {
      if (activeFilter !== "all" && request.statusCategory !== activeFilter) {
        return false;
      }

      if (!query) return true;

      return (
        request.endpoint.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query) ||
        request.project.toLowerCase().includes(query)
      );
    });
  }, [requests, activeFilter, pathFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredRequests.length,
  );

  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  const handleFilterChange = (filter: StatusFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePathFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPathFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleRequestKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    request: ApiRequest,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSelectRequest(request);
  };

  return (
    <section className="@container flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-surface">
      <header className="border-b border-border-default px-4 py-4 sm:px-5">
        <div className="flex min-w-0 flex-col gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-text-primary">
              Recent Requests
            </h2>

            <p className="mt-0.5 truncate text-xs text-text-secondary">
              Latest API activity across your projects
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5 @md:flex-row @md:items-center @2xl:shrink-0">
            <div className="min-w-0 @md:w-44 @2xl:w-48">
              <Input
                icon={<Filter className="h-3.5 w-3.5" />}
                type="text"
                value={pathFilter}
                onChange={handlePathFilterChange}
                placeholder="Filter path..."
                aria-label="Filter requests by path, ID, or project"
                className="w-full"
              />
            </div>

            <div className="flex min-w-0 max-w-full items-center gap-2 overflow-x-auto pb-0.5">
              {statusFilters.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => handleFilterChange(filter.id)}
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
          </div>
        </div>
      </header>

      <ul className="block divide-y divide-border-default/60 @xl:hidden">
        {paginatedRequests.map((request) => {
          const isSelected = request.id === selectedRequestId;
          const isError = request.status >= 500;
          const isWarning = request.status >= 400 && request.status < 500;

          return (
            <li key={request.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectRequest(request)}
                onKeyDown={(event) => handleRequestKeyDown(event, request)}
                aria-label={`Inspect request ${request.id}`}
                className={cn(
                  "cursor-pointer px-4 py-3 outline-none transition-colors duration-150",
                  "hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                  isSelected && "bg-accent-soft/60 hover:bg-accent-soft/80",
                )}
              >
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <MethodBadge method={request.method} />

                    <span className="truncate font-code-inline text-xs font-medium text-text-primary">
                      {request.endpoint}
                    </span>
                  </div>

                  <StatusBadge
                    status={request.status}
                    text={request.statusText}
                  />
                </div>

                <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2 font-code-inline text-[11px] text-text-secondary">
                  <span className="truncate">
                    {request.time} · {request.project}
                  </span>

                  <span
                    className={cn(
                      "shrink-0",
                      isError
                        ? "font-semibold text-danger"
                        : isWarning
                          ? "font-medium text-warning"
                          : "text-text-secondary",
                    )}
                  >
                    {request.latency.toLocaleString()}ms
                  </span>
                </div>
              </div>
            </li>
          );
        })}

        {paginatedRequests.length === 0 && (
          <li className="px-4 py-10 text-center font-code-inline text-[11px] text-text-secondary">
            No requests match the current filters.
          </li>
        )}
      </ul>

      <div className="hidden min-w-0 @xl:block">
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
            <caption className="sr-only">Recent API requests</caption>

            <colgroup>
              <col className="w-[104px]" />
              <col className="w-[72px]" />
              <col />
              <col className="w-[168px]" />
              <col className="w-[96px]" />
              <col className="hidden @3xl:table-column @3xl:w-[132px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-border-default bg-surface-muted font-label-sm uppercase tracking-wider text-text-secondary">
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-2.5 font-semibold"
                >
                  Time (UTC)
                </th>

                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Method
                </th>

                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Endpoint
                </th>

                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Status
                </th>

                <th
                  scope="col"
                  className="px-4 py-2.5 text-right font-semibold"
                >
                  Latency
                </th>

                <th
                  scope="col"
                  className="hidden px-4 py-2.5 font-semibold @3xl:table-cell"
                >
                  Project
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-default/60 text-xs">
              {paginatedRequests.map((request) => {
                const isSelected = request.id === selectedRequestId;
                const isError = request.status >= 500;
                const isWarning = request.status >= 400 && request.status < 500;

                return (
                  <tr
                    key={request.id}
                    tabIndex={0}
                    onClick={() => onSelectRequest(request)}
                    onKeyDown={(event) => handleRequestKeyDown(event, request)}
                    aria-label={`Inspect request ${request.id}`}
                    className={cn(
                      "cursor-pointer outline-none transition-colors duration-150",
                      "hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                      isSelected && "bg-accent-soft/60 hover:bg-accent-soft/80",
                    )}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-code-inline text-text-primary">
                      {request.time}
                    </td>

                    <td className="px-4 py-3">
                      <MethodBadge method={request.method} />
                    </td>

                    <td className="truncate px-4 py-3 font-code-inline font-medium text-text-primary">
                      {request.endpoint}
                    </td>

                    <td className="overflow-hidden px-4 py-3">
                      <StatusBadge
                        status={request.status}
                        text={request.statusText}
                      />
                    </td>

                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-right font-code-inline",
                        isError
                          ? "font-semibold text-danger"
                          : isWarning
                            ? "font-medium text-warning"
                            : "text-text-secondary",
                      )}
                    >
                      {request.latency.toLocaleString()}ms
                    </td>

                    <td className="hidden truncate px-4 py-3 text-text-secondary @3xl:table-cell">
                      {request.project}
                    </td>
                  </tr>
                );
              })}

              {paginatedRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center font-code-inline text-[11px] text-text-secondary"
                  >
                    No requests match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={filteredRequests.length}
        startIndex={filteredRequests.length > 0 ? startIndex + 1 : 0}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        itemLabel="requests"
      />
    </section>
  );
};
