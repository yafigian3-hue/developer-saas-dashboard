import type { FC, ReactNode } from "react";
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

const SPARKLINE: Record<SparklineType, { d: string; x: number; y: number }> = {
  "sparkline-up": { d: "M2 18 L12 14 L22 16 L32 9 L42 12 L52 4", x: 52, y: 4 },
  "sparkline-down": {
    d: "M2 5 L12 9 L22 6 L32 13 L42 10 L52 17",
    x: 52,
    y: 17,
  },
  "sparkline-latency": {
    d: "M2 16 L12 14 L22 15 L32 9 L42 11 L52 7",
    x: 52,
    y: 7,
  },
};

const Sparkline: FC<{ type: SparklineType }> = ({ type }) => {
  const s = SPARKLINE[type];
  return (
    <svg
      viewBox="0 0 54 22"
      className="h-6 w-18 shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <path
        d={s.d}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="stroke-text-secondary/50"
      />
      <circle cx={s.x} cy={s.y} r="2" className="fill-text-primary" />
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
  const isPrimary = variant === "primary";
  const arrow = trend === "down" ? "↓" : badgeType === "neutral" ? null : "↑";
  const sparkline =
    isPrimary && chartType && chartType !== "bars" ? chartType : null;

  return (
    <article
      aria-label={title}
      className={cn(
        "min-w-0",
        isPrimary
          ? "pb-4 pt-4.5 sm:py-5.5"
          : "grid grid-cols-[1fr_auto] items-center gap-x-4 py-3.5 sm:block sm:py-5.5",
        className,
      )}
    >
      <p className="col-start-1 truncate text-[12.5px] text-text-secondary">
        {title}
      </p>

      <div
        className={cn(
          isPrimary
            ? "mt-2 flex items-end justify-between gap-4"
            : "col-start-2 row-span-2 row-start-1 text-right sm:mt-2 sm:text-left",
        )}
      >
        <div
          className={cn(
            "min-w-0 whitespace-nowrap font-semibold tabular-nums text-text-primary",
            isPrimary
              ? "text-[40px] leading-[1.1] tracking-[-0.04em] sm:text-[46px]"
              : "text-[22px] leading-[1.1] tracking-tight sm:text-[28px]",
          )}
        >
          {value}
        </div>

        {sparkline && (
          <div className="mb-1.5 hidden sm:block">
            <Sparkline type={sparkline} />
          </div>
        )}
      </div>

      <div className="col-start-1 mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-[12.5px] leading-snug text-text-secondary sm:mt-2">
        <span
          className={cn(
            "font-medium tabular-nums",
            badgeType === "positive" ? "text-success" : "text-text-secondary",
          )}
        >
          {arrow && (
            <>
              <span aria-hidden="true">{arrow}</span>
              <span className="sr-only">
                {trend === "down" ? "Decreased" : "Increased"}
              </span>{" "}
            </>
          )}
          {badgeText}
        </span>
        <span aria-hidden="true" className="text-text-secondary/40">
          ·
        </span>
        <span className="min-w-0">{subtitle}</span>
      </div>
    </article>
  );
};
