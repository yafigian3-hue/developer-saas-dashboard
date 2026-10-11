import React from "react";
import { endpointErrors } from "../../data/dashboard";
import { cn } from "../../lib/utils";

interface ErrorsByEndpointProps {
  onInspectTrace: (endpointPath?: string) => void;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);

export const ErrorsByEndpoint: React.FC<ErrorsByEndpointProps> = ({
  onInspectTrace,
}) => {
  const maxPercentage = Math.max(
    ...endpointErrors.map((item) => item.percentage),
    1,
  );

  return (
    <section aria-labelledby="errors-by-endpoint" className="min-w-0">
      <header>
        <h2
          id="errors-by-endpoint"
          className="text-sm font-semibold text-text-primary"
        >
          Errors by endpoint
        </h2>

        <p className="mt-0.5 text-[12.5px] text-text-secondary">
          Top failure sources · 30d
        </p>
      </header>

      {endpointErrors.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-text-secondary">
          No endpoint errors recorded.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border-default">
          {endpointErrors.map((item) => {
            const is5xx = item.statusCode >= 500;
            const percentage = clamp(item.percentage);

            return (
              <li key={`${item.statusCode}-${item.path}`}>
                <button
                  type="button"
                  onClick={() => onInspectTrace(item.path)}
                  aria-label={`Inspect trace for ${item.path}, status ${item.statusCode}, ${item.percentage}% of errors`}
                  className={cn(
                    "group block w-full py-3 text-left outline-none",
                    "transition-colors duration-150 hover:bg-surface-muted/60",
                    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                  )}
                >
                  <span className="flex min-w-0 items-baseline justify-between gap-3">
                    <span className="flex min-w-0 items-baseline gap-2.5">
                      <span
                        className={cn(
                          "w-8 shrink-0 font-mono text-[12px] tabular-nums",
                          is5xx ? "text-danger" : "text-warning",
                        )}
                      >
                        {item.statusCode}
                      </span>

                      <span className="min-w-0 truncate font-mono text-[12.5px] text-text-primary">
                        {item.path}
                      </span>
                    </span>

                    <span className="shrink-0 font-mono text-[12.5px] font-medium tabular-nums text-text-primary">
                      {item.percentage}%
                    </span>
                  </span>

                  <span
                    className="mt-2 block h-[3px] bg-surface-muted"
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block h-full transition-[width] duration-200",
                        is5xx ? "bg-danger/75" : "bg-warning/75",
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </span>

                  <span className="mt-1.5 flex items-center justify-between gap-3 text-[11.5px] text-text-secondary">
                    <span>{is5xx ? "Server error" : "Client error"}</span>

                    <span className="shrink-0 text-accent opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                      Inspect trace →
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
