import React, { useState } from "react";
import { Search, Terminal, Copy, Check, Filter } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { LogEntry } from "../types/log";
import { cn } from "../lib/utils";

export interface LogsPageProps {
  logs: LogEntry[];
  initialSearch?: string;
  onClearFilter?: () => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ logs, initialSearch = "" }) => {
  const [search, setSearch] = useState(initialSearch);
  const [levelFilter, setLevelFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== "all" && log.level !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchMsg = log.message.toLowerCase().includes(q);
      const matchService = log.service.toLowerCase().includes(q);
      const matchReq = log.requestId?.toLowerCase().includes(q);
      return matchMsg || matchService || matchReq;
    }
    return true;
  });

  const handleCopy = (log: LogEntry) => {
    const text = `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.service}] ${
      log.requestId ? `[${log.requestId}] ` : ""
    }${log.message}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] leading-8 font-semibold text-[#181C1A] tracking-tight">
              System Logs
            </h1>
            <span className="font-label-sm bg-[#ECEFEB] text-[#58605B] px-2 py-0.5 rounded border border-[#C0C8C3]/50">
              Stdout / Stderr
            </span>
          </div>
          <p className="text-[13px] text-[#68716B] mt-0.5">
            Distributed tracing and worker logs ingested from edge nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#68716B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter logs or request ID..."
              className="h-8 w-56 pl-8 pr-3 text-[12px] bg-white border border-[#D9DDD7] rounded-lg focus:outline-none focus:border-[#265344]"
            />
          </div>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 border-b border-[#D9DDD7] pb-3">
        {(["all", "info", "warn", "error"] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setLevelFilter(lvl)}
            className={cn(
              "px-3 py-1 text-label-sm rounded-md uppercase transition-colors",
              levelFilter === lvl
                ? "bg-[#265344] text-white font-medium"
                : "bg-white text-[#68716B] border border-[#D9DDD7] hover:bg-[#F0F1EE]"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Log Terminal Viewer */}
      <div className="bg-[#F0F1EE] rounded-lg border border-[#D9DDD7] shadow-sm overflow-hidden font-mono text-[12px]">
        <div className="p-3 bg-[#E6E9E5] border-b border-[#D9DDD7] flex items-center justify-between text-[#58605B] text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#265344]" />
            <span>gateway-daemon.log</span>
          </div>
          <span>{filteredLogs.length} events logged</span>
        </div>

        <div className="divide-y divide-[#D9DDD7]/50 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => {
            const isError = log.level === "error";
            const isWarn = log.level === "warn";

            return (
              <div
                key={log.id}
                className={cn(
                  "p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-[#EAECE8] transition-colors group",
                  isError && "bg-[#FDF4F4]/50",
                  isWarn && "bg-[#FBF5ED]/50"
                )}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#68716B] text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </span>
                    <Badge
                      variant={
                        isError ? "danger" : isWarn ? "warning" : "neutral"
                      }
                      fontFamily="mono"
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-[#265344] text-[11px]">
                      [{log.service}]
                    </span>
                    {log.requestId && (
                      <span className="text-[#68716B] bg-white px-1.5 py-0.2 rounded border border-[#D9DDD7] text-[11px]">
                        {log.requestId}
                      </span>
                    )}
                  </div>

                  <p
                    className={cn(
                      "text-[12px] leading-relaxed break-all font-code-inline",
                      isError
                        ? "text-[#B84C45] font-medium"
                        : isWarn
                        ? "text-[#B47A2C]"
                        : "text-[#181C1A]"
                    )}
                  >
                    {log.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(log)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-white text-[#58605B] transition-opacity shrink-0 self-end sm:self-start"
                  title="Copy log entry"
                >
                  {copiedId === log.id ? (
                    <Check className="w-3.5 h-3.5 text-[#3F765C]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-[#68716B]">
              No log records matching your filter criteria.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
