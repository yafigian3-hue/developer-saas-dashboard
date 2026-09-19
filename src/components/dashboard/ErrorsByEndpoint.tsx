import React from "react";
import { AlertTriangle } from "lucide-react";
import { endpointErrors } from "../../data/dashboard";
import { cn } from "../../lib/utils";

interface ErrorsByEndpointProps {
  onInspectTrace: () => void;
  onSelectEndpoint?: (path: string) => void;
}

export const ErrorsByEndpoint: React.FC<ErrorsByEndpointProps> = ({
  onInspectTrace,
  onSelectEndpoint,
}) => {
  return (
    <section className="flex h-full min-w-0 flex-col rounded-lg border border-border-default bg-surface p-4 sm:p-5">
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-4 flex min-w-0 items-start justify-between gap-4 border-b border-border-default pb-3.5">
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-semibold tracking-tight text-text-primary">
              Errors by Endpoint
            </h2>

            <p className="mt-0.5 font-label-sm text-text-secondary">
              Top failure sources (30d)
            </p>
          </div>
        </div>

        {/* Endpoint Errors */}
        <div className="space-y-3">
          {endpointErrors.map((item) => {
            const is5xx = item.statusCode >= 500;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onSelectEndpoint?.(item.path)}
                disabled={!onSelectEndpoint}
                className={cn(
                  "block w-full min-w-0 text-left",
                  onSelectEndpoint &&
                    "cursor-pointer rounded-sm outline-none transition-colors duration-150 hover:bg-surface-muted/60 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                  !onSelectEndpoint && "cursor-default",
                )}
              >
                <div className="flex min-w-0 items-center justify-between gap-3 font-label-sm">
                  <span
                    className={cn(
                      "min-w-0 truncate font-code-inline font-medium",
                      onSelectEndpoint
                        ? "text-text-primary"
                        : "text-text-secondary",
                    )}
                  >
                    {item.path}
                  </span>

                  <span
                    className={cn(
                      "shrink-0 font-semibold",
                      is5xx ? "text-danger" : "text-warning",
                    )}
                  >
                    {item.percentage}% ({item.statusCode})
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-sm bg-surface-muted">
                  <div
                    className={cn(
                      "h-full rounded-sm transition-[width] duration-200",
                      is5xx ? "bg-danger" : "bg-warning",
                    )}
                    style={{
                      width: `${Math.min(Math.max(item.percentage, 0), 100)}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}

          {endpointErrors.length === 0 && (
            <div className="py-8 text-center font-label-sm text-text-secondary">
              No endpoint errors recorded.
            </div>
          )}
        </div>
      </div>

      {/* Operational Callout */}
      <div className="mt-4 flex shrink-0 items-center justify-between gap-3 border-t border-border-default pt-3.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
          <span className="truncate text-[12px] font-medium text-text-primary">
            Checkout timeout elevated
          </span>
        </div>

        <button
          type="button"
          onClick={onInspectTrace}
          className="shrink-0 rounded px-2 py-1 font-label-sm font-medium text-accent transition-colors duration-150 hover:bg-accent-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          Inspect Trace
        </button>
      </div>
    </section>
  );
};
