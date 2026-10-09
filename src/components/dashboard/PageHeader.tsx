import type { FC } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
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
  "inline-flex h-9 items-center rounded-md border border-border-default bg-surface text-[12.5px] text-text-primary transition-colors duration-150 hover:border-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-8";

export const PageHeader: FC<PageHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  environment,
  onEnvironmentChange,
  isLiveSyncing,
  onToggleLiveSync,
}) => {
  return (
    <header className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="min-w-0">
        <h1 className="text-[27px] font-semibold leading-tight tracking-[-0.035em] text-text-primary sm:text-[30px]">
          Overview
        </h1>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {/* Environment */}
        <div className="relative min-w-0 flex-1 sm:flex-none">
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
              "w-full min-w-0 cursor-pointer appearance-none pl-6 pr-8 font-mono text-[11.5px] sm:min-w-[164px]",
            )}
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary/60"
            aria-hidden="true"
          />
        </div>

        {/* Date range */}
        <div className="relative min-w-0 flex-1 sm:flex-none">
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
              "w-full min-w-0 cursor-pointer appearance-none pl-8 pr-8 sm:min-w-[140px]",
            )}
          >
            {DATE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary/60"
            aria-hidden="true"
          />
        </div>

        {/* Live sync */}
        <button
          type="button"
          onClick={onToggleLiveSync}
          aria-pressed={isLiveSyncing}
          title={isLiveSyncing ? "Live sync enabled" : "Live sync disabled"}
          className={cn(
            controlBase,
            "shrink-0 gap-2 px-3",
            isLiveSyncing
              ? "border-accent/30 bg-accent-soft text-accent"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              isLiveSyncing ? "bg-success" : "bg-text-secondary/50",
            )}
            aria-hidden="true"
          />
          <span>Live sync</span>
        </button>
      </div>
    </header>
  );
};
