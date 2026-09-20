import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronsUpDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface PageHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  environment: string;
  onEnvironmentChange: (env: string) => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
}

const dateOptions = [
  { label: "Today (24h)", range: "24h", display: "Today (Last 24h)" },
  { label: "Last 7 Days", range: "7d", display: "Jan 24, 2025 – Feb 1, 2025" },
  { label: "Last 30 Days", range: "30d", display: "Jan 1, 2025 – Feb 1, 2025" },
  { label: "Last 90 Days", range: "90d", display: "Nov 1, 2024 – Feb 1, 2025" },
] as const;

const envOptions = [
  { label: "prod-cluster-01", status: "healthy", region: "us-east-1" },
  { label: "prod-cluster-02", status: "healthy", region: "eu-central-1" },
  { label: "staging-cluster-01", status: "degraded", region: "us-west-2" },
] as const;

export const PageHeader: React.FC<PageHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  environment,
  onEnvironmentChange,
  isLiveSyncing,
  onToggleLiveSync,
}) => {
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [envMenuOpen, setEnvMenuOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);

  const selectedDate =
    dateOptions.find((option) => option.range === dateRange) ?? dateOptions[2];

  const selectedEnvironment =
    envOptions.find((option) => option.label === environment) ?? envOptions[0];

  useEffect(() => {
    if (!dateMenuOpen && !envMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (dateRef.current && !dateRef.current.contains(target)) {
        setDateMenuOpen(false);
      }
      if (envRef.current && !envRef.current.contains(target)) {
        setEnvMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDateMenuOpen(false);
        setEnvMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dateMenuOpen, envMenuOpen]);

  const toggleDateMenu = () => {
    setDateMenuOpen((open) => !open);
    setEnvMenuOpen(false);
  };

  const toggleEnvMenu = () => {
    setEnvMenuOpen((open) => !open);
    setDateMenuOpen(false);
  };

  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      {/* Page identity */}
      <div className="min-w-0 flex-1">
        <h1 className="text-[20px] font-semibold leading-7 tracking-tight text-text-primary">
          Overview
        </h1>
        <p className="mt-0.5 truncate text-[12px] leading-4 text-text-secondary">
          Monitor your API activity, gateway latency, and operational health.
        </p>
      </div>

      {/* Controls */}
      <div className="flex min-w-0 flex-row flex-wrap items-center gap-1.5">
        {/* Date selector */}
        <div ref={dateRef} className="relative min-w-0 max-w-full">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={dateMenuOpen}
            aria-controls="page-header-date-menu"
            onClick={toggleDateMenu}
            className={cn(
              "flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded border border-border-default bg-surface px-2.5 text-text-primary transition-colors duration-150",
              "hover:bg-surface-muted",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              dateMenuOpen && "border-accent",
            )}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
            <span className="truncate font-label-sm">
              {selectedDate.display}
            </span>
            <span className="shrink-0 rounded border border-border-default bg-surface-muted px-1 py-0.5 font-label-sm text-text-secondary">
              {selectedDate.range}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-text-secondary transition-transform duration-150",
                dateMenuOpen && "rotate-180",
              )}
            />
          </button>

          {dateMenuOpen && (
            <div
              id="page-header-date-menu"
              role="listbox"
              aria-label="Date range"
              className="absolute right-0 z-40 mt-1.5 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded border border-border-default bg-surface py-1 shadow-sm"
            >
              {dateOptions.map((option) => {
                const isSelected = option.range === dateRange;
                return (
                  <button
                    key={option.range}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onDateRangeChange(option.range);
                      setDateMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                      isSelected
                        ? "bg-accent-soft text-accent"
                        : "text-text-primary hover:bg-surface-muted",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-medium">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate font-label-sm text-text-secondary">
                        {option.display}
                      </span>
                    </span>
                    {isSelected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Environment selector */}
        <div ref={envRef} className="relative min-w-0 max-w-full">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={envMenuOpen}
            aria-controls="page-header-environment-menu"
            onClick={toggleEnvMenu}
            className={cn(
              "flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded border border-border-default bg-surface px-2.5 text-text-primary transition-colors duration-150",
              "hover:bg-surface-muted",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              envMenuOpen && "border-accent",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                selectedEnvironment.status === "healthy"
                  ? "bg-success"
                  : "bg-warning",
              )}
              aria-hidden="true"
            />
            <span className="truncate font-label-sm font-medium">
              {selectedEnvironment.label}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
          </button>

          {envMenuOpen && (
            <div
              id="page-header-environment-menu"
              role="listbox"
              aria-label="Environment"
              className="absolute right-0 z-40 mt-1.5 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded border border-border-default bg-surface py-1 shadow-sm"
            >
              {envOptions.map((option) => {
                const isSelected = option.label === environment;
                const isHealthy = option.status === "healthy";
                return (
                  <button
                    key={option.label}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onEnvironmentChange(option.label);
                      setEnvMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                      isSelected
                        ? "bg-accent-soft text-accent"
                        : "text-text-primary hover:bg-surface-muted",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          isHealthy ? "bg-success" : "bg-warning",
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate text-[12px] font-medium">
                        {option.label}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          "font-label-sm",
                          isHealthy ? "text-success" : "text-warning",
                        )}
                      >
                        {option.region}
                      </span>
                      {isSelected && (
                        <Check
                          className="h-4 w-4 text-accent"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Sync */}
        <button
          type="button"
          onClick={onToggleLiveSync}
          aria-pressed={isLiveSyncing}
          className={cn(
            "flex h-7 shrink-0 items-center justify-center gap-1.5 rounded border px-2.5 font-label-sm font-medium transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
            isLiveSyncing
              ? "border-success/30 bg-success/10 text-success"
              : "border-border-default bg-surface text-text-primary hover:bg-surface-muted",
          )}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isLiveSyncing && "animate-spin")}
            aria-hidden="true"
          />
          <span>{isLiveSyncing ? "Syncing..." : "Live Sync"}</span>
        </button>
      </div>
    </header>
  );
};
