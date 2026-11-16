import React, { useEffect, useId, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { volumeChartData, type TimeSeriesPoint } from "../../data/dashboard";
import { cn } from "../../lib/utils";

interface RequestVolumeChartProps {
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

type ChartRange = "24h" | "7d" | "30d" | "90d";

const ranges: ChartRange[] = ["24h", "7d", "30d", "90d"];

const isChartRange = (value: string): value is ChartRange =>
  ranges.includes(value as ChartRange);

export const RequestVolumeChart: React.FC<RequestVolumeChartProps> = ({
  selectedRange = "30d",
  onRangeChange,
}) => {
  const gradientId = `request-volume-${useId().replace(/:/g, "")}`;
  const initialRange = isChartRange(selectedRange) ? selectedRange : "30d";

  const [activeRange, setActiveRange] = useState<ChartRange>(initialRange);

  useEffect(() => {
    if (isChartRange(selectedRange)) {
      setActiveRange(selectedRange);
    }
  }, [selectedRange]);

  const currentData = volumeChartData[activeRange] ?? volumeChartData["30d"];

  const peakPoint =
    currentData.find((point) => point.isPeak) ??
    currentData[Math.floor(currentData.length / 2)];

  const handleRangeClick = (range: ChartRange) => {
    setActiveRange(range);
    onRangeChange?.(range);
  };

  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-default bg-surface">
      {/* Header */}
      <header className="flex min-w-0 flex-col gap-3 border-b border-border-default px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-text-primary sm:text-[15px]">
            Request Volume &amp; Throughput
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Aggregated across all global edge locations
          </p>
        </div>

        <div
          className="grid w-full grid-cols-4 gap-1 rounded-lg bg-surface-muted p-1 sm:w-auto sm:shrink-0"
          role="group"
          aria-label="Request volume range"
        >
          {ranges.map((range) => {
            const isActive = activeRange === range;

            return (
              <button
                key={range}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleRangeClick(range)}
                className={cn(
                  "inline-flex h-8 min-w-0 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                  isActive
                    ? "bg-surface text-accent shadow-sm"
                    : "text-text-secondary hover:bg-surface/60 hover:text-text-primary",
                )}
              >
                {range}
              </button>
            );
          })}
        </div>
      </header>

      {/* Chart */}
      <div className="flex min-w-0 flex-1 flex-col px-3.5 py-4 sm:px-5 sm:py-5">
        <div className="h-[190px] min-w-0 w-full sm:h-[220px] lg:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0.16}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--color-border-default)"
                strokeDasharray="3 4"
                vertical={false}
                opacity={0.65}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fill: "var(--color-text-secondary)",
                  fontSize: 11,
                  fontFamily: "inherit",
                }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border-default)" }}
                tickMargin={10}
                minTickGap={24}
              />

              <YAxis
                tick={{
                  fill: "var(--color-text-secondary)",
                  fontSize: 11,
                  fontFamily: "inherit",
                }}
                tickLine={false}
                axisLine={false}
                width={42}
                tickFormatter={(value: number) =>
                  value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
                }
              />

              <Tooltip
                cursor={{
                  stroke: "var(--color-border-default)",
                  strokeDasharray: "3 3",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0]?.payload as
                    | TimeSeriesPoint
                    | undefined;

                  if (!data) return null;

                  return (
                    <div className="w-48 rounded-lg border border-border-default bg-surface p-3 shadow-lg">
                      <div className="mb-2 flex items-center justify-between gap-2 border-b border-border-default pb-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {data.date}
                        </span>
                        <span className="text-[11px] font-medium text-success">
                          {data.sla}% SLA
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-text-secondary">
                            Requests
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-text-primary">
                            {data.requests.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-text-secondary">
                            p95 Latency
                          </span>
                          <span className="text-xs font-medium tabular-nums text-text-primary">
                            {data.p95Latency} ms
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="requests"
                stroke="var(--color-accent)"
                strokeWidth={2.2}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-surface)",
                  stroke: "var(--color-accent)",
                  strokeWidth: 2,
                }}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak volume */}
        {peakPoint && (
          <div className="mt-3 flex min-w-0 items-center justify-between gap-3 border-t border-border-default pt-3">
            <span className="shrink-0 text-xs text-text-secondary">
              Peak volume
            </span>

            <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              <span className="truncate text-xs font-semibold tabular-nums text-text-primary">
                {peakPoint.requests.toLocaleString()} reqs
              </span>
              <span className="shrink-0 text-[11px] text-text-secondary">
                {peakPoint.date}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Request status summary */}
      <footer className="grid grid-cols-3 divide-x divide-border-default border-t border-border-default bg-surface-muted/40">
        <div className="min-w-0 px-2.5 py-3 sm:px-4 sm:py-3.5">
          <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            <span className="truncate text-[10px] text-text-secondary sm:text-xs">
              Success (2xx)
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-xs font-semibold tabular-nums text-text-primary sm:text-sm">
            <span>1,821,410</span>
            <span className="text-[10px] font-medium text-success sm:text-xs">
              (98.8%)
            </span>
          </div>
        </div>

        <div className="min-w-0 px-2.5 py-3 sm:px-4 sm:py-3.5">
          <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
            <span className="truncate text-[10px] text-text-secondary sm:text-xs">
              Client Error (4xx)
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-xs font-semibold tabular-nums text-text-primary sm:text-sm">
            <span>14,320</span>
            <span className="text-[10px] font-medium text-warning sm:text-xs">
              (0.8%)
            </span>
          </div>
        </div>

        <div className="min-w-0 px-2.5 py-3 sm:px-4 sm:py-3.5">
          <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
            <span className="truncate text-[10px] text-text-secondary sm:text-xs">
              Server Error (5xx)
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-xs font-semibold tabular-nums text-text-primary sm:text-sm">
            <span>6,561</span>
            <span className="text-[10px] font-medium text-danger sm:text-xs">
              (0.4%)
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
};
