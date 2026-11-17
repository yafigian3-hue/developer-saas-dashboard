import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Filter, Terminal } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { LogEntry } from "../types/log";
import { cn } from "../lib/utils";

export interface LogsPageProps {
  logs: LogEntry[];
  initialSearch?: string;
}

type LogLevel = "all" | "info" | "warn" | "error";

const levelFilters: Array<{ id: LogLevel; label: string }> = [
  { id: "all", label: "All" },
  { id: "info", label: "Info" },
  { id: "warn", label: "Warn" },
  { id: "error", label: "Error" },
];

export const LogsPage: React.FC<LogsPageProps> = ({
  logs,
  initialSearch = "",
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSearch(initialSearch);
    setExpandedLogId(null);
  }, [initialSearch]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const query = search.trim().toLowerCase();

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== "all" && log.level !== levelFilter) {
      return false;
    }

    if (!query) return true;

    return (
      log.message.toLowerCase().includes(query) ||
      log.service.toLowerCase().includes(query) ||
      log.requestId?.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query) ||
      log.details?.path?.toLowerCase().includes(query) ||
      log.details?.clientIp?.toLowerCase().includes(query) ||
      log.details?.host?.toLowerCase().includes(query)
    );
  });

  const handleLevelChange = (level: LogLevel) => {
    setLevelFilter(level);
    setExpandedLogId(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setExpandedLogId(null);
  };

  const handleCopyEventId = async (logId: string) => {
    try {
      if (!navigator.clipboard) return;

      await navigator.clipboard.writeText(logId);
      setCopiedId(logId);

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedId((currentId) => (currentId === logId ? null : currentId));
        copyTimeoutRef.current = null;
      }, 1600);
    } catch {
      setCopiedId(null);
    }
  };

  const handleToggleLog = (logId: string) => {
    setExpandedLogId((currentId) => (currentId === logId ? null : logId));
  };

  const getLevelVariant = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "danger";
      case "warn":
        return "warning";
      default:
        return "neutral";
    }
  };

  const errorCount = logs.filter((log) => log.level === "error").length;
  const warningCount = logs.filter((log) => log.level === "warn").length;

  return (
    <PageContainer>
      <header className="@container">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-4 @md:flex-row @md:items-end @md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-primary">
                  System Logs
                </h1>
                <Badge variant="neutral" fontFamily="mono">
                  Stdout / Stderr
                </Badge>
              </div>

              <p className="mt-1 max-w-2xl text-[13px] leading-5 text-text-secondary">
                Inspect application events, errors, and distributed worker logs.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="font-label-sm text-text-secondary">
                  Log stream
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 @sm:grid-cols-3">
            <div className="rounded-lg border border-border-default bg-surface p-3">
              <p className="font-label-sm text-text-secondary">Total events</p>
              <p className="mt-1 font-code-inline text-xl font-semibold text-text-primary">
                {logs.length.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-border-default bg-surface p-3">
              <p className="font-label-sm text-text-secondary">Errors</p>
              <p className="mt-1 font-code-inline text-xl font-semibold text-danger">
                {errorCount.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 rounded-lg border border-border-default bg-surface p-3 @sm:col-span-1">
              <p className="font-label-sm text-text-secondary">Warnings</p>
              <p className="mt-1 font-code-inline text-xl font-semibold text-warning">
                {warningCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section
        aria-label="System log viewer"
        className="min-w-0 overflow-hidden rounded-xl border border-border-default bg-surface"
      >
        <div className="flex min-w-0 flex-col gap-3 border-b border-border-default p-3 sm:p-4 @lg:flex-row @lg:items-center @lg:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Terminal className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[13px] font-semibold text-text-primary">
                gateway-daemon.log
              </h2>
              <p className="mt-0.5 text-[11px] text-text-secondary">
                Application event viewer
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2 @sm:flex-row @sm:items-center @lg:w-auto">
            <div className="min-w-0 flex-1 @lg:w-[260px] @lg:flex-none">
              <Input
                icon={<Filter className="h-3.5 w-3.5" />}
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search logs or request ID..."
                aria-label="Search logs or request ID"
                className="w-full"
              />
            </div>

            <div
              className="grid grid-cols-4 gap-1 rounded-lg border border-border-default bg-surface-muted p-1 @sm:w-auto"
              aria-label="Log level filter"
            >
              {levelFilters.map((filter) => {
                const isActive = levelFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => handleLevelChange(filter.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-md px-3 py-1.5 font-label-sm transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                      isActive
                        ? "bg-surface text-text-primary shadow-sm"
                        : "text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border-default bg-surface-muted/50 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            <span className="truncate font-code-inline text-[11px] text-text-secondary">
              {query ? "Filtered results" : "All events"}
            </span>
          </div>

          <span className="shrink-0 font-code-inline text-[11px] font-medium text-text-secondary">
            {filteredLogs.length.toLocaleString()} events
          </span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto sm:max-h-[640px]">
          {filteredLogs.length > 0 ? (
            <div className="divide-y divide-border-default/60">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const isError = log.level === "error";
                const isWarn = log.level === "warn";
                const isCopied = copiedId === log.id;

                return (
                  <article
                    key={log.id}
                    className={cn(
                      "min-w-0 transition-colors duration-150",
                      isError && "bg-danger/[0.035]",
                      isWarn && "bg-warning/[0.035]",
                      isExpanded && "bg-surface-muted/40",
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-2 px-3 py-3 sm:gap-3 sm:px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleLog(log.id)}
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded
                            ? `Collapse log ${log.id}`
                            : `Expand log ${log.id}`
                        }
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleLog(log.id)}
                          aria-expanded={isExpanded}
                          className="block w-full min-w-0 rounded-sm text-left outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                            <span className="shrink-0 font-code-inline text-[11px] tabular-nums text-text-secondary">
                              {log.timestamp}
                            </span>

                            <Badge
                              variant={getLevelVariant(log.level)}
                              fontFamily="mono"
                            >
                              {log.level.toUpperCase()}
                            </Badge>

                            <span className="min-w-0 truncate font-code-inline text-[11px] font-medium text-accent">
                              [{log.service}]
                            </span>

                            {log.requestId && (
                              <span className="max-w-full truncate rounded-md border border-border-default bg-surface-muted px-1.5 py-0.5 font-code-inline text-[10px] text-text-secondary">
                                {log.requestId}
                              </span>
                            )}
                          </div>

                          <p
                            className={cn(
                              "mt-2 break-words font-code-inline text-[12px] leading-5",
                              isError
                                ? "font-medium text-danger"
                                : isWarn
                                  ? "text-warning"
                                  : "text-text-primary",
                            )}
                          >
                            {log.message}
                          </p>
                        </button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyEventId(log.id)}
                        aria-label={`Copy event ID ${log.id}`}
                        title={isCopied ? "Event ID copied" : "Copy event ID"}
                        className="mt-0.5 h-8 w-8 shrink-0"
                      >
                        {isCopied ? (
                          <Check
                            className="h-3.5 w-3.5 text-success"
                            aria-hidden="true"
                          />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border-default bg-surface-muted/40 px-3 py-4 sm:px-4 sm:pl-16">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="text-[12px] font-semibold text-text-primary">
                            Event details
                          </h3>
                          <span className="font-code-inline text-[10px] text-text-tertiary">
                            ID: {log.id}
                          </span>
                        </div>

                        <dl className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                            <dt className="font-label-sm text-text-secondary">
                              Event ID
                            </dt>
                            <dd className="mt-1.5 break-all font-code-inline text-[11px] text-text-primary">
                              {log.id}
                            </dd>
                          </div>

                          <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                            <dt className="font-label-sm text-text-secondary">
                              Service
                            </dt>
                            <dd className="mt-1.5 break-words font-code-inline text-[11px] text-text-primary">
                              {log.service}
                            </dd>
                          </div>

                          <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                            <dt className="font-label-sm text-text-secondary">
                              Timestamp
                            </dt>
                            <dd className="mt-1.5 break-words font-code-inline text-[11px] text-text-primary">
                              {log.timestamp}
                            </dd>
                          </div>

                          <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                            <dt className="font-label-sm text-text-secondary">
                              Request ID
                            </dt>
                            <dd className="mt-1.5 break-all font-code-inline text-[11px] text-text-primary">
                              {log.requestId || "—"}
                            </dd>
                          </div>

                          {log.details?.path && (
                            <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                              <dt className="font-label-sm text-text-secondary">
                                Path
                              </dt>
                              <dd className="mt-1.5 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.path}
                              </dd>
                            </div>
                          )}

                          {log.details?.statusCode !== undefined && (
                            <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                              <dt className="font-label-sm text-text-secondary">
                                Status Code
                              </dt>
                              <dd
                                className={cn(
                                  "mt-1.5 font-code-inline text-[11px] font-semibold",
                                  log.details.statusCode >= 500
                                    ? "text-danger"
                                    : log.details.statusCode >= 400
                                      ? "text-warning"
                                      : "text-success",
                                )}
                              >
                                {log.details.statusCode}
                              </dd>
                            </div>
                          )}

                          {log.details?.durationMs !== undefined && (
                            <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                              <dt className="font-label-sm text-text-secondary">
                                Duration
                              </dt>
                              <dd className="mt-1.5 font-code-inline text-[11px] text-text-primary">
                                {log.details.durationMs.toLocaleString()}ms
                              </dd>
                            </div>
                          )}

                          {log.details?.clientIp && (
                            <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                              <dt className="font-label-sm text-text-secondary">
                                Client IP
                              </dt>
                              <dd className="mt-1.5 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.clientIp}
                              </dd>
                            </div>
                          )}

                          {log.details?.host && (
                            <div className="min-w-0 rounded-lg border border-border-default bg-surface p-3">
                              <dt className="font-label-sm text-text-secondary">
                                Host
                              </dt>
                              <dd className="mt-1.5 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.host}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div className="mt-4 rounded-lg border border-border-default bg-surface p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <Terminal
                              className="h-3.5 w-3.5 text-accent"
                              aria-hidden="true"
                            />
                            <h4 className="font-label-sm text-text-secondary">
                              Full message
                            </h4>
                          </div>

                          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-code-inline text-[11px] leading-5 text-text-primary">
                            {log.message}
                          </pre>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-default bg-surface-muted text-text-tertiary">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="mt-4 text-[13px] font-semibold text-text-primary">
                No log records found
              </h3>

              <p className="mt-1 max-w-xs text-[12px] leading-5 text-text-secondary">
                No events match your current search or level filter. Try
                adjusting your filters.
              </p>

              {(search || levelFilter !== "all") && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setLevelFilter("all");
                    setExpandedLogId(null);
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-default bg-surface-muted/40 px-3 py-2.5 sm:px-4">
          <span className="font-label-sm text-text-secondary">
            Showing filtered events
          </span>
          <span className="font-code-inline text-[11px] text-text-secondary">
            {filteredLogs.length.toLocaleString()} /{" "}
            {logs.length.toLocaleString()}
          </span>
        </div>
      </section>
    </PageContainer>
  );
};
