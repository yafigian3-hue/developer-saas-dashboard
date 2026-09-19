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
  const initialRange = isChartRange(selectedRange) ? selectedRange : "30d";
  const [activeRange, setActiveRange] = useState<ChartRange>(initialRange);
  const [isChartHovered, setIsChartHovered] = useState(false);

  const gradientId = `request-volume-gradient-${useId().replace(/:/g, "")}`;

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
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border-default bg-surface">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border-default px-4 py-4 sm:px-5 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-text-primary">
            Request Volume &amp; Throughput
          </h2>

          <p className="mt-0.5 truncate font-label-sm text-text-secondary">
            Aggregated across all global edge locations
          </p>
        </div>

        <div
          className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-md border border-border-default bg-surface-muted p-0.5"
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
                  "shrink-0 rounded-sm px-2.5 py-1.5 font-label-sm transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                  isActive
                    ? "bg-surface font-semibold text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="min-h-[280px] flex-1 px-4 py-5 sm:px-5 sm:py-6">
        <div
          className="h-56 w-full"
          onMouseEnter={() => setIsChartHovered(true)}
          onMouseLeave={() => setIsChartHovered(false)}
        >
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
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--color-border-default)"
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.8}
              />

              <XAxis
                dataKey="date"
                stroke="var(--color-text-secondary)"
                fontSize={11}
                fontFamily="var(--font-mono)"
                tickLine={false}
                axisLine={{
                  stroke: "var(--color-border-default)",
                }}
                dy={6}
              />

              <YAxis
                stroke="var(--color-text-secondary)"
                fontSize={11}
                fontFamily="var(--font-mono)"
                tickLine={false}
                axisLine={false}
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

                  const data = payload[0]?.payload as TimeSeriesPoint;

                  return (
                    <div className="w-48 rounded border border-border-default bg-surface p-2.5 shadow-sm">
                      <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-border-default pb-1">
                        <span className="font-label-sm font-semibold text-text-primary">
                          {data.date}
                        </span>

                        <span className="font-label-sm text-success">
                          {data.sla}% SLA
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-3 font-label-sm">
                          <span className="text-text-secondary">Requests:</span>

                          <span className="font-semibold text-text-primary">
                            {data.requests.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 font-label-sm">
                          <span className="text-text-secondary">
                            p95 Latency:
                          </span>

                          <span className="font-medium text-text-primary">
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
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-surface)",
                  stroke: "var(--color-accent)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Peak summary */}
        {!isChartHovered && peakPoint && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border-default pt-3">
            <span className="font-label-sm text-text-secondary">
              Peak volume
            </span>

            <div className="flex items-center gap-3">
              <span className="font-code-inline font-semibold text-text-primary">
                {peakPoint.requests.toLocaleString()} reqs
              </span>

              <span className="font-label-sm text-text-secondary">
                {peakPoint.date}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="grid shrink-0 grid-cols-1 border-t border-border-default bg-surface-muted/30 sm:grid-cols-3 sm:divide-x sm:divide-border-default">
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-success"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <div className="font-label-sm text-text-secondary">
              Success (2xx)
            </div>

            <div className="font-label-md font-semibold text-text-primary">
              1,821,410{" "}
              <span className="font-normal text-success">(98.8%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-warning"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <div className="font-label-sm text-text-secondary">
              Client Error (4xx)
            </div>

            <div className="font-label-md font-semibold text-text-primary">
              14,320 <span className="font-normal text-warning">(0.8%)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-danger"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <div className="font-label-sm text-text-secondary">
              Server Error (5xx)
            </div>

            <div className="font-label-md font-semibold text-text-primary">
              6,561 <span className="font-normal text-danger">(0.4%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
