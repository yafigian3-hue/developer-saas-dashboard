import type { FC } from "react";
import { Activity, CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface PageHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  environment: string;
  onEnvironmentChange: (env: string) => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
}

const ENVIRONMENTS = [
  "prod-cluster-01",
  "staging-cluster-01",
  "dev-sandbox",
] as const;

const DATE_RANGES = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
] as const;

const controlBase =
  "inline-flex h-9 items-center rounded-lg border border-border-default bg-surface px-3 text-xs font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export const PageHeader: FC<PageHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  environment,
  onEnvironmentChange,
  isLiveSyncing,
  onToggleLiveSync,
}) => {
  return (
    <header className="flex min-w-0 flex-col gap-5 border-b border-border-default pb-5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
            Workspace / Analytics
          </span>
        </div>

        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.045em] text-text-primary sm:text-[32px]">
          Overview
        </h1>

        <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-[13px]">
          Monitor API performance, traffic, and gateway health.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center lg:justify-end">
        <div className="relative min-w-0">
          <span
            className="pointer-events-none absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-success"
            aria-hidden="true"
          />

          <select
            value={environment}
            onChange={(event) => onEnvironmentChange(event.target.value)}
            aria-label="Environment"
            className={cn(
              controlBase,
              "h-10 w-full cursor-pointer appearance-none pl-6 pr-8 font-mono text-[10px] sm:h-9 sm:w-auto sm:min-w-40 sm:text-[11px]",
            )}
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
        </div>

        <div className="relative min-w-0">
          <CalendarDays
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />

          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value)}
            aria-label="Date range"
            className={cn(
              controlBase,
              "h-10 w-full cursor-pointer appearance-none pl-8 pr-7 sm:h-9 sm:w-auto sm:min-w-36",
            )}
          >
            {DATE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          onClick={onToggleLiveSync}
          aria-pressed={isLiveSyncing}
          title={isLiveSyncing ? "Live sync enabled" : "Live sync disabled"}
          className={cn(
            "col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:col-span-1 sm:h-9",
            isLiveSyncing
              ? "border-accent/25 bg-accent-soft text-accent"
              : "border-border-default bg-surface text-text-secondary hover:border-text-secondary/40 hover:text-text-primary",
          )}
        >
          <Activity size={14} aria-hidden="true" />
          <span>Live sync</span>
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isLiveSyncing ? "bg-success" : "bg-text-secondary/40",
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
};
