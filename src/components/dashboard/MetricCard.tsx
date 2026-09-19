import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "../../lib/utils";

export type MetricSentiment = "positive" | "negative" | "neutral";
export type MetricTrend = "up" | "down" | "flat";

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  badgeText: string;
  badgeType?: MetricSentiment;
  trend?: MetricTrend;
  subtitle: React.ReactNode;
  chartType?: "sparkline-up" | "sparkline-down" | "sparkline-latency" | "bars";
  className?: string;
}

const badgeStyles: Record<MetricSentiment, string> = {
  positive: "border-success/30 bg-success/10 text-success",
  negative: "border-danger/30 bg-danger/10 text-danger",
  neutral: "border-border-default bg-surface-muted text-text-secondary",
};

const sentimentChartColor: Record<MetricSentiment, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-accent",
};

const barShades: Record<MetricSentiment, [string, string, string, string]> = {
  positive: ["bg-success/20", "bg-success/40", "bg-success/70", "bg-success"],
  negative: ["bg-danger/20", "bg-danger/40", "bg-danger/70", "bg-danger"],
  neutral: ["bg-accent/20", "bg-accent/40", "bg-accent/70", "bg-accent"],
};

const defaultTrend: Record<MetricSentiment, MetricTrend> = {
  positive: "up",
  negative: "down",
  neutral: "flat",
};

const sparklinePaths = {
  "sparkline-up": {
    line: "M0 26 L15 20 L30 24 L45 12 L60 16 L75 4",
    area: "M0 26 L15 20 L30 24 L45 12 L60 16 L75 4 L75 32 L0 32 Z",
  },
  "sparkline-down": {
    line: "M0 8 L15 14 L30 11 L45 22 L60 18 L75 27",
    area: "M0 8 L15 14 L30 11 L45 22 L60 18 L75 27 L75 32 L0 32 Z",
  },
  "sparkline-latency": {
    line: "M0 18 L16 16 L32 20 L48 10 L64 12 L78 8",
    area: "M0 18 L16 16 L32 20 L48 10 L64 12 L78 8 L78 32 L0 32 Z",
  },
} as const;

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  badgeText,
  badgeType = "positive",
  trend,
  subtitle,
  chartType = "sparkline-up",
  className,
}) => {
  const resolvedTrend = trend ?? defaultTrend[badgeType];
  const chartColor = sentimentChartColor[badgeType];
  const sparklineShape =
    chartType === "bars" ? null : sparklinePaths[chartType];

  return (
    <article
      className={cn(
        // Height is only forced once the chart appears (sm+); below that
        // the card hugs its content instead of leaving dead whitespace
        "flex min-h-[104px] flex-col justify-between rounded-lg border border-border-default bg-surface p-3.5 sm:min-h-[140px] sm:p-4 lg:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-label-sm min-w-0 truncate uppercase tracking-wider text-text-secondary">
          {title}
        </span>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-label-sm",
            badgeStyles[badgeType],
          )}
        >
          {resolvedTrend === "up" && (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          )}
          {resolvedTrend === "down" && (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          )}
          <span>{badgeText}</span>
        </span>
      </div>

      <div className="mt-3 flex min-w-0 items-end justify-between gap-3 sm:mt-4 sm:gap-4">
        <div className="min-w-0">
          <div className="font-metric-display truncate text-text-primary">
            {value}
          </div>

          <div className="mt-1 truncate font-label-sm text-text-secondary">
            {subtitle}
          </div>
        </div>

        {chartType === "bars" ? (
          <div
            className="hidden shrink-0 items-end gap-1 sm:flex"
            aria-hidden="true"
          >
            <span
              className={cn("h-5 w-2 rounded-sm", barShades[badgeType][0])}
            />
            <span
              className={cn("h-6 w-2 rounded-sm", barShades[badgeType][1])}
            />
            <span
              className={cn("h-7 w-2 rounded-sm", barShades[badgeType][2])}
            />
            <span
              className={cn("h-8 w-2 rounded-sm", barShades[badgeType][3])}
            />
          </div>
        ) : (
          sparklineShape && (
            <svg
              aria-hidden="true"
              className={cn(
                "hidden h-8 w-20 shrink-0 overflow-visible sm:block",
                chartColor,
              )}
              fill="none"
              viewBox="0 0 80 32"
            >
              <path
                d={sparklineShape.line}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d={sparklineShape.area}
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          )
        )}
      </div>
    </article>
  );
};
