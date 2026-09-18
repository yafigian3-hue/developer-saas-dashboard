import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  RefreshCw,
  Share2,
  Check,
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

  const dateOptions = [
    { label: "Today (24h)", range: "24h", display: "Today (Last 24h)" },
    { label: "Last 7 Days", range: "7d", display: "Jan 24, 2025 – Feb 1, 2025" },
    { label: "Last 30 Days", range: "30d", display: "Jan 1, 2025 – Feb 1, 2025" },
    { label: "Last 90 Days", range: "90d", display: "Nov 1, 2024 – Feb 1, 2025" },
  ];

  const envOptions = [
    { label: "prod-cluster-01", status: "healthy", region: "us-east-1" },
    { label: "prod-cluster-02", status: "healthy", region: "eu-central-1" },
    { label: "staging-cluster-01", status: "degraded", region: "us-west-2" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateMenuOpen(false);
      }
      if (envRef.current && !envRef.current.contains(e.target as Node)) {
        setEnvMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = dateOptions.find((d) => d.range === dateRange) || dateOptions[2];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] leading-8 font-semibold text-[#181C1A] tracking-tight">
            Overview
          </h1>
          <span className="font-label-sm bg-[#ECEFEB] text-[#58605B] px-2 py-0.5 rounded border border-[#C0C8C3]/50">
            US-EAST-1
          </span>
        </div>
        <p className="text-[13px] text-[#68716B] mt-0.5">
          Monitor your API activity, gateway latency, and operational health.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Selector Dropdown */}
        <div ref={dateRef} className="relative">
          <button
            type="button"
            onClick={() => setDateMenuOpen(!dateMenuOpen)}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D9DDD7] shadow-sm text-[#181C1A] hover:bg-[#F7F7F5] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#58605B]" />
            <span className="font-label-md">{selectedDate.display}</span>
            <span className="font-label-sm text-[#58605B] bg-[#ECEFEB] px-1.5 py-0.5 rounded">
              {selectedDate.range}
            </span>
            <ChevronDown className="w-4 h-4 text-[#58605B] ml-1" />
          </button>

          {dateMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#D9DDD7] rounded-lg shadow-lg py-1 z-40">
              {dateOptions.map((opt) => (
                <button
                  key={opt.range}
                  type="button"
                  onClick={() => {
                    onDateRangeChange(opt.range);
                    setDateMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left text-[12px] hover:bg-[#F0F1EE] transition-colors",
                    opt.range === dateRange
                      ? "text-[#265344] font-semibold bg-[#E4ECE8]/50"
                      : "text-[#181C1A]"
                  )}
                >
                  <div>
                    <div>{opt.label}</div>
                    <div className="font-label-sm text-[#68716B] text-[10px]">
                      {opt.display}
                    </div>
                  </div>
                  {opt.range === dateRange && <Check className="w-4 h-4 text-[#265344]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Environment Dropdown */}
        <div ref={envRef} className="relative">
          <button
            type="button"
            onClick={() => setEnvMenuOpen(!envMenuOpen)}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D9DDD7] shadow-sm text-[#181C1A] hover:bg-[#F7F7F5] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#265344] animate-pulse" />
            <span className="font-label-md text-[#181C1A] font-medium">
              {environment}
            </span>
            <ChevronsUpDown className="w-4 h-4 text-[#58605B]" />
          </button>

          {envMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-[#D9DDD7] rounded-lg shadow-lg py-1 z-40">
              {envOptions.map((env) => (
                <button
                  key={env.label}
                  type="button"
                  onClick={() => {
                    onEnvironmentChange(env.label);
                    setEnvMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left font-label-md hover:bg-[#F0F1EE] transition-colors",
                    env.label === environment
                      ? "text-[#265344] font-semibold bg-[#E4ECE8]/50"
                      : "text-[#181C1A]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        env.status === "healthy" ? "bg-[#265344]" : "bg-[#B47A2C]"
                      )}
                    />
                    <span>{env.label}</span>
                  </div>
                  <span className="font-label-sm text-[#68716B]">{env.region}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Sync Button */}
        <button
          type="button"
          onClick={onToggleLiveSync}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9DDD7] shadow-sm transition-colors text-[12px] font-medium",
            isLiveSyncing
              ? "bg-[#EBF3EF] text-[#265344] border-[#C6DFD3]"
              : "bg-white hover:bg-[#ECEFEB] text-[#181C1A]"
          )}
        >
          <RefreshCw
            className={cn(
              "w-4 h-4 text-[#265344]",
              isLiveSyncing && "animate-spin"
            )}
          />
          <span>{isLiveSyncing ? "Syncing..." : "Live Sync"}</span>
        </button>
      </div>
    </div>
  );
};
