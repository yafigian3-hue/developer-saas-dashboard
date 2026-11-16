import React from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { endpointErrors } from "../../data/dashboard";
import { cn } from "../../lib/utils";

interface ErrorsByEndpointProps {
  onInspectTrace: (endpointPath?: string) => void;
}

export const ErrorsByEndpoint: React.FC<ErrorsByEndpointProps> = ({
  onInspectTrace,
}) => {
  const maxPercentage = Math.max(
    ...endpointErrors.map((item) => item.percentage),
    1,
  );

  return (
    <section
      aria-labelledby="errors-by-endpoint"
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-surface"
    >
      <header className="flex items-start justify-between gap-3 border-b border-border-default px-3.5 py-4 sm:px-4">
        <div className="min-w-0">
          <h2
            id="errors-by-endpoint"
            className="text-sm font-semibold tracking-tight text-text-primary"
          >
            Errors by endpoint
          </h2>
          <p className="mt-1 text-[11px] text-text-secondary sm:text-xs">
            Top failure sources
          </p>
        </div>

        <span className="shrink-0 rounded-md border border-border-default bg-surface-muted px-2 py-1 text-[10px] font-medium text-text-secondary sm:text-[11px]">
          Last 30d
        </span>
      </header>

      {endpointErrors.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <p className="text-center text-xs text-text-secondary">
            No endpoint errors recorded.
          </p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-border-default px-3.5 sm:px-4">
          {endpointErrors.map((item, index) => {
            const is5xx = item.statusCode >= 500;
            const relativePercentage = Math.min(
              (item.percentage / maxPercentage) * 100,
              100,
            );

            return (
              <li key={`${item.statusCode}-${item.path}`}>
                <button
                  type="button"
                  onClick={() => onInspectTrace(item.path)}
                  aria-label={`Inspect trace for ${item.path}, status ${item.statusCode}, ${item.percentage}% of errors`}
                  className={cn(
                    "group block w-full py-3 text-left sm:py-3.5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                  )}
                >
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums",
                          is5xx
                            ? "bg-danger/10 text-danger"
                            : "bg-warning/10 text-warning",
                        )}
                      >
                        {item.statusCode}
                      </span>

                      <span className="min-w-0 truncate font-mono text-[11px] text-text-primary transition-colors group-hover:text-accent sm:text-xs">
                        {item.path}
                      </span>
                    </div>

                    <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-text-primary sm:text-xs">
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="ml-[30px] mt-2 h-1 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-300",
                        is5xx ? "bg-danger" : "bg-warning",
                      )}
                      style={{ width: `${relativePercentage}%` }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="ml-[30px] mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-text-secondary sm:text-[11px]">
                      {is5xx ? "Server error" : "Client error"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 sm:text-[11px]">
                      Inspect trace
                      <ChevronRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <footer className="flex items-center justify-between gap-2 border-t border-border-default bg-surface-muted/40 px-3.5 py-2.5 sm:px-4">
        <span className="text-[10px] text-text-secondary sm:text-[11px]">
          Endpoint error distribution
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-text-secondary sm:text-[11px]">
          View traces
          <ArrowUpRight size={12} aria-hidden="true" />
        </span>
      </footer>
    </section>
  );
};
