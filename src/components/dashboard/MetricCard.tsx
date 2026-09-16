import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  badgeText: string;
  badgeType?: "positive" | "negative" | "neutral";
  subtitle: React.ReactNode;
  chartType?: "sparkline-up" | "sparkline-down" | "sparkline-latency" | "bars";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  badgeText,
  badgeType = "positive",
  subtitle,
  chartType = "sparkline-up",
  className,
}) => {
  const badgeStyles = {
    positive: "bg-[#EBF3EF] text-[#3F765C] border-[#C6DFD3]",
    negative: "bg-[#FDF4F4] text-[#B84C45] border-[#F0C4C1]",
    neutral: "bg-[#ECEFEB] text-[#414945] border-[#C0C8C3]/50",
  };

  return (
    <div
      className={cn(
        "bg-white p-5 rounded-lg border border-[#D9DDD7] shadow-sm flex flex-col justify-between min-h-[140px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-sm uppercase tracking-wider text-[#58605B]">
          {title}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 font-label-sm px-1.5 py-0.5 rounded border",
            badgeStyles[badgeType]
          )}
        >
          {badgeType === "positive" && <ArrowUp className="w-3 h-3" />}
          {badgeType === "negative" && <ArrowDown className="w-3 h-3" />}
          {badgeText}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <div className="font-metric-display text-[#181C1A] tracking-tight">
            {value}
          </div>
          <div className="font-label-sm text-[#58605B] mt-1">{subtitle}</div>
        </div>

        {/* Right visualization */}
        {chartType === "sparkline-up" && (
          <svg
            className="w-20 h-8 text-[#265344] overflow-visible shrink-0"
            fill="none"
            viewBox="0 0 80 32"
          >
            <path
              d="M0 26 L15 20 L30 24 L45 12 L60 16 L75 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M0 26 L15 20 L30 24 L45 12 L60 16 L75 4 L75 32 L0 32 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        )}

        {chartType === "sparkline-down" && (
          <svg
            className="w-20 h-8 text-[#3F765C] overflow-visible shrink-0"
            fill="none"
            viewBox="0 0 80 32"
          >
            <path
              d="M0 8 L15 14 L30 11 L45 22 L60 18 L75 27"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M0 8 L15 14 L30 11 L45 22 L60 18 L75 27 L75 32 L0 32 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        )}

        {chartType === "sparkline-latency" && (
          <svg
            className="w-20 h-8 text-[#265344] overflow-visible shrink-0"
            fill="none"
            viewBox="0 0 80 32"
          >
            <path
              d="M0 18 L16 16 L32 20 L48 10 L64 12 L78 8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M0 18 L16 16 L32 20 L48 10 L64 12 L78 8 L78 32 L0 32 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
          </svg>
        )}

        {chartType === "bars" && (
          <div className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-8 bg-[#265344]/20 rounded-sm" />
            <span className="inline-block w-2.5 h-8 bg-[#265344]/40 rounded-sm" />
            <span className="inline-block w-2.5 h-8 bg-[#265344]/70 rounded-sm" />
            <span className="inline-block w-2.5 h-8 bg-[#265344] rounded-sm" />
          </div>
        )}
      </div>
    </div>
  );
};
