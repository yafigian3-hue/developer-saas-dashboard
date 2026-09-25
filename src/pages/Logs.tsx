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

const levelFilters: Array<{
  id: LogLevel;
  label: string;
}> = [
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

    if (!query) {
      return true;
    }

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
      if (!navigator.clipboard) {
        return;
      }

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

  const handleLogKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    logId: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleToggleLog(logId);
  };

  return (
    <PageContainer>
      <header className="@container">
        <div className="flex min-w-0 flex-col gap-4 @xl:flex-row @xl:items-start @xl:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-primary">
                System Logs
              </h1>

              <Badge variant="neutral" fontFamily="mono">
                Stdout / Stderr
              </Badge>
            </div>

            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-text-secondary">
              Distributed tracing and worker logs ingested from edge nodes.
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5 @xl:w-[340px] @xl:shrink-0">
            <Input
              icon={<Filter className="h-3.5 w-3.5" />}
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Filter logs or request ID..."
              aria-label="Filter logs or request ID"
              className="w-full"
            />

            <div className="min-w-0 overflow-x-auto">
              <div
                className="flex w-max items-center gap-2"
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
        </div>
      </header>

      <section
        aria-label="System log viewer"
        className="min-w-0 overflow-hidden rounded-lg border border-border-default bg-surface"
      >
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border-default bg-surface-muted px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal
              className="h-3.5 w-3.5 shrink-0 text-accent"
              aria-hidden="true"
            />

            <span className="truncate font-code-inline font-medium text-text-primary">
              gateway-daemon.log
            </span>
          </div>

          <span className="shrink-0 font-label-sm text-text-secondary">
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
                      "min-w-0 transition-colors duration-100",
                      isError && "bg-danger/5",
                      isWarn && "bg-warning/5",
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-2.5 px-3 py-3 sm:gap-3 sm:px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleLog(log.id)}
                        aria-expanded={isExpanded}
                        aria-label={
                          isExpanded
                            ? `Collapse log ${log.id}`
                            : `Expand log ${log.id}`
                        }
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-transparent text-text-secondary transition-colors duration-150 hover:border-border-default hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            isExpanded && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleLog(log.id)}
                        onKeyDown={(event) => handleLogKeyDown(event, log.id)}
                        className="min-w-0 flex-1 cursor-pointer rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                          <span className="shrink-0 font-code-inline text-[11px] text-text-secondary">
                            {log.timestamp}
                          </span>

                          <Badge
                            variant={
                              isError
                                ? "danger"
                                : isWarn
                                  ? "warning"
                                  : "neutral"
                            }
                            fontFamily="mono"
                          >
                            {log.level.toUpperCase()}
                          </Badge>

                          <span className="min-w-0 truncate font-code-inline text-[11px] font-medium text-accent">
                            [{log.service}]
                          </span>

                          {log.requestId && (
                            <span className="max-w-full truncate rounded border border-border-default bg-surface-muted px-1.5 py-0.5 font-code-inline text-[11px] text-text-secondary">
                              {log.requestId}
                            </span>
                          )}
                        </div>

                        <p
                          className={cn(
                            "mt-1.5 break-words font-code-inline text-[12px] leading-5",
                            isError
                              ? "font-medium text-danger"
                              : isWarn
                                ? "text-warning"
                                : "text-text-primary",
                          )}
                        >
                          {log.message}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyEventId(log.id)}
                        aria-label={`Copy event ID ${log.id}`}
                        title={isCopied ? "Event ID copied" : "Copy event ID"}
                        className="mt-0.5 shrink-0"
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
                      <div className="border-t border-border-default/60 bg-surface-muted/50 px-3 py-3 sm:px-4 sm:pl-16">
                        <dl className="grid min-w-0 gap-x-6 gap-y-3 sm:grid-cols-2">
                          <div className="min-w-0">
                            <dt className="font-label-sm text-text-secondary">
                              Event ID
                            </dt>
                            <dd className="mt-1 break-all font-code-inline text-[11px] text-text-primary">
                              {log.id}
                            </dd>
                          </div>

                          <div className="min-w-0">
                            <dt className="font-label-sm text-text-secondary">
                              Service
                            </dt>
                            <dd className="mt-1 break-words font-code-inline text-[11px] text-text-primary">
                              {log.service}
                            </dd>
                          </div>

                          <div className="min-w-0">
                            <dt className="font-label-sm text-text-secondary">
                              Timestamp
                            </dt>
                            <dd className="mt-1 break-words font-code-inline text-[11px] text-text-primary">
                              {log.timestamp}
                            </dd>
                          </div>

                          <div className="min-w-0">
                            <dt className="font-label-sm text-text-secondary">
                              Request ID
                            </dt>
                            <dd className="mt-1 break-all font-code-inline text-[11px] text-text-primary">
                              {log.requestId || "—"}
                            </dd>
                          </div>

                          {log.details?.path && (
                            <div className="min-w-0">
                              <dt className="font-label-sm text-text-secondary">
                                Path
                              </dt>
                              <dd className="mt-1 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.path}
                              </dd>
                            </div>
                          )}

                          {log.details?.statusCode !== undefined && (
                            <div className="min-w-0">
                              <dt className="font-label-sm text-text-secondary">
                                Status Code
                              </dt>
                              <dd
                                className={cn(
                                  "mt-1 font-code-inline text-[11px] font-medium",
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
                            <div className="min-w-0">
                              <dt className="font-label-sm text-text-secondary">
                                Duration
                              </dt>
                              <dd className="mt-1 font-code-inline text-[11px] text-text-primary">
                                {log.details.durationMs.toLocaleString()}ms
                              </dd>
                            </div>
                          )}

                          {log.details?.clientIp && (
                            <div className="min-w-0">
                              <dt className="font-label-sm text-text-secondary">
                                Client IP
                              </dt>
                              <dd className="mt-1 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.clientIp}
                              </dd>
                            </div>
                          )}

                          {log.details?.host && (
                            <div className="min-w-0">
                              <dt className="font-label-sm text-text-secondary">
                                Host
                              </dt>
                              <dd className="mt-1 break-all font-code-inline text-[11px] text-text-primary">
                                {log.details.host}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <div className="mt-4 border-t border-border-default/60 pt-3">
                          <div className="font-label-sm text-text-secondary">
                            Message
                          </div>

                          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-words font-code-inline text-[11px] leading-5 text-text-primary">
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
            <div className="px-4 py-14 text-center">
              <div className="font-code-inline text-[12px] font-medium text-text-primary">
                No log records found.
              </div>

              <p className="mt-1 text-[12px] text-text-secondary">
                Try changing the search query or log level filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
};
