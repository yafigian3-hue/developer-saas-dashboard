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
  /**
   * Opsional. Sparkline hanya dirender untuk variant "primary".
   * Nilai "bars" tetap diterima agar kode lama tidak error, tetapi diabaikan.
   */
  chartType?: SparklineType | "bars";
  /** primary = angka utama (besar). secondary = pendamping (tenang). */
  variant?: "primary" | "secondary";
  /** Dipakai parent untuk padding/divider sel, mis. "sm:px-6". */
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

/* Garis tipis netral, tanpa fill. Hanya titik terakhir yang diberi penekanan. */
const Sparkline: FC<{ type: SparklineType }> = ({ type }) => {
  const s = SPARKLINE[type];
  return (
    <svg
      viewBox="0 0 54 22"
      className="h-6 w-[72px] shrink-0 overflow-visible"
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

/**
 * Tanpa border, tanpa background, tanpa shadow.
 * Pengelompokan dilakukan parent (garis tipis antar sel), contoh:
 *
 * <section className="grid grid-cols-1 divide-y divide-border-default border-y border-border-default
 *                     sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
 *   <MetricCard variant="primary" className="sm:col-span-3 sm:border-b sm:border-border-default lg:col-span-1 lg:border-b-0" ... />
 *   <MetricCard className="sm:border-l sm:border-border-default sm:px-6 sm:first:border-l-0" ... />
 * </section>
 *
 * <640px : metrik sekunder menjadi baris label (kiri) – nilai (kanan).
 * >=640px: tersusun vertikal: label, nilai, tren + konteks.
 */
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
          ? "pb-4 pt-[18px] sm:py-[22px]"
          : "grid grid-cols-[1fr_auto] items-center gap-x-4 py-3.5 sm:block sm:py-[22px]",
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
              : "text-[22px] leading-[1.1] tracking-[-0.025em] sm:text-[28px]",
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
