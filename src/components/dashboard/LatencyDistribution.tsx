import React from "react";
import { Gauge } from "lucide-react";

interface DistributionItem {
  label: string;
  percentage: number;
  tone: "success" | "warning" | "danger";
}

const distribution: DistributionItem[] = [
  { label: "< 100ms", percentage: 74, tone: "success" },
  { label: "100–300ms", percentage: 21, tone: "warning" },
  { label: "> 300ms", percentage: 5, tone: "danger" },
];

const toneStyles = {
  success: {
    bar: "bg-success",
    text: "text-success",
  },
  warning: {
    bar: "bg-warning",
    text: "text-warning",
  },
  danger: {
    bar: "bg-danger",
    text: "text-danger",
  },
} as const;

export const LatencyDistribution: React.FC = () => {
  return (
    <section className="min-w-0 rounded-lg border border-border-default bg-surface p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold tracking-tight text-text-primary">
            Latency Distribution
          </h2>

          <p className="mt-0.5 font-label-sm text-text-secondary">
            Global response times
          </p>
        </div>

        <Gauge
          className="h-4 w-4 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
      </div>

      {/* Distribution Bar */}
      <div
        role="img"
        aria-label="Latency distribution: 74 percent under 100 milliseconds, 21 percent between 100 and 300 milliseconds, 5 percent above 300 milliseconds"
      >
        <div className="grid h-3 w-full grid-cols-[74fr_21fr_5fr] overflow-hidden rounded-sm bg-surface-muted">
          {distribution.map((item) => (
            <div
              key={item.label}
              className={toneStyles[item.tone].bar}
              style={{ minWidth: item.percentage > 0 ? "3px" : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Distribution Metrics */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {distribution.map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded border border-border-default bg-surface-muted px-2 py-2.5 text-center"
          >
            <span className="block truncate font-label-sm text-text-secondary">
              {item.label}
            </span>

            <span
              className={`mt-0.5 block font-label-md font-semibold ${toneStyles[item.tone].text}`}
            >
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
