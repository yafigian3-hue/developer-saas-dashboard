import type { FC, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

type SparklineType = "sparkline-up" | "sparkline-down" | "sparkline-latency";

export interface MetricCardProps {
  title: string;
  badgeText: string;
  badgeType: "positive" | "neutral";
  value: ReactNode;
  subtitle: ReactNode;
  trend?: "up" | "down";
  chartType?: SparklineType | "bars";
  variant?: "primary" | "secondary";
  className?: string;
}

const SPARKLINE: Record<SparklineType, string> = {
  "sparkline-up": "M2 18 L12 14 L22 16 L32 9 L42 12 L52 4",
  "sparkline-down": "M2 5 L12 9 L22 6 L32 13 L42 10 L52 17",
  "sparkline-latency": "M2 16 L12 14 L22 15 L32 9 L42 11 L52 7",
};

const Sparkline: FC<{ type: SparklineType }> = ({ type }) => {
  const isChartRising = type === "sparkline-up" || type === "sparkline-latency";
  const endY = type === "sparkline-down" ? 17 : type === "sparkline-up" ? 4 : 7;
  const chartColor = isChartRising ? "text-success" : "text-danger";

  return (
    <svg
      viewBox="0 0 54 22"
      className="hidden h-6 w-14 shrink-0 overflow-visible sm:block"
      aria-hidden="true"
    >
      <path
        d={SPARKLINE[type]}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={cn(
          "transition-colors duration-200",
          isChartRising ? "stroke-success" : "stroke-danger",
        )}
      />
      <circle
        cx="52"
        cy={endY}
        r="2"
        className={cn("fill-current", chartColor)}
      />
    </svg>
  );
};

export const MetricCard: FC<MetricCardProps> = ({
  title,
  badgeText,
  badgeType,
  value,
  subtitle,
  trend,
  chartType,
  variant = "secondary",
  className,
}) => {
  const isPositive = badgeType === "positive";
  const isPrimary = variant === "primary";
  const hasSparkline = chartType && chartType !== "bars";

  const TrendIcon =
    trend === "down" ? ArrowDownRight : trend === "up" ? ArrowUpRight : Minus;

  return (
    <article
      aria-label={title}
      className={cn(
        "flex min-w-0 flex-col rounded-lg border border-border-default bg-surface p-3 transition-colors duration-200 hover:border-text-secondary/30 sm:rounded-xl sm:p-4 xl:p-5",
        isPrimary && "border-accent/20 bg-accent-soft/30",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-medium text-text-secondary sm:text-sm">
          {title}
        </p>

        {hasSparkline && <Sparkline type={chartType as SparklineType} />}
      </div>

      <div className="mt-3 min-w-0 sm:mt-4">
        <div className="overflow-hidden font-sans text-xl font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl xl:text-[30px]">
          <span className="tabular-nums">{value}</span>
        </div>

        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-4",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-surface-muted text-text-secondary",
            )}
          >
            <TrendIcon size={12} strokeWidth={2.2} aria-hidden="true" />
            {badgeText}
          </span>

          <span className="min-w-0 text-xs leading-5 text-text-secondary">
            {subtitle}
          </span>
        </div>
      </div>
    </article>
  );
};
