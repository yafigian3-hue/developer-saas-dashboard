import React, { useState } from "react";
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

export const RequestVolumeChart: React.FC<RequestVolumeChartProps> = ({
  selectedRange = "30d",
  onRangeChange,
}) => {
  const [activeRange, setActiveRange] = useState<string>(selectedRange);
  const [hoveredPoint, setHoveredPoint] = useState<TimeSeriesPoint | null>(null);

  const ranges = ["24h", "7d", "30d", "90d"];
  const currentData = volumeChartData[activeRange] || volumeChartData["30d"];

  const handleRangeClick = (range: string) => {
    setActiveRange(range);
    if (onRangeChange) onRangeChange(range);
  };

  // Peak point or hovered point for callout
  const peakPoint =
    currentData.find((p) => p.isPeak) || currentData[Math.floor(currentData.length / 2)];
  const displayPoint = hoveredPoint || peakPoint;

  return (
    <div className="bg-white rounded-lg border border-[#D9DDD7] shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="p-5 border-b border-[#D9DDD7]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[16px] text-[#181C1A] font-semibold tracking-tight">
            Request Volume &amp; Throughput
          </div>
          <div className="font-label-sm text-[#68716B] mt-0.5">
            Aggregated across all global edge locations
          </div>
        </div>

        <div className="flex items-center bg-[#F1F4F1] p-0.5 rounded-lg border border-[#C0C8C3]/50">
          {ranges.map((r) => {
            const isActive = activeRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeClick(r)}
                className={cn(
                  "px-2.5 py-1 text-label-sm transition-colors rounded",
                  isActive
                    ? "bg-white text-[#181C1A] font-semibold shadow-sm"
                    : "text-[#68716B] hover:text-[#181C1A]"
                )}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative p-5 sm:p-6 flex-1 min-h-[300px] flex flex-col justify-between">
        <div className="w-full h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  setHoveredPoint(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F6B5B" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#3F6B5B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#D9DDD7"
                opacity={0.8}
              />
              <XAxis
                dataKey="date"
                stroke="#68716B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={{ stroke: "#D9DDD7" }}
                dy={6}
              />
              <YAxis
                stroke="#68716B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val >= 1000 ? `${val / 1000}k` : val}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TimeSeriesPoint;
                    return (
                      <div className="bg-white border border-[#D9DDD7] shadow-md rounded-lg p-2.5 z-20 w-48 font-mono">
                        <div className="flex items-center justify-between border-b border-[#D9DDD7]/60 pb-1 mb-1.5">
                          <span className="font-label-sm font-semibold text-[#181C1A]">
                            {data.date}
                          </span>
                          <span className="font-label-sm text-[#3F765C] bg-[#EBF3EF] px-1 rounded">
                            {data.sla}% SLA
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between font-label-sm">
                            <span className="text-[#68716B]">Requests:</span>
                            <span className="text-[#181C1A] font-semibold">
                              {data.requests.toLocaleString()} reqs
                            </span>
                          </div>
                          <div className="flex justify-between font-label-sm">
                            <span className="text-[#68716B]">p95 Latency:</span>
                            <span className="text-[#181C1A] font-medium">
                              {data.p95Latency} ms
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#265344"
                strokeWidth={2.5}
                fill="url(#areaGradient)"
                activeDot={{
                  r: 5,
                  fill: "#FFFFFF",
                  stroke: "#265344",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Floating Peak Tooltip Pin when not actively hovering another point */}
          {!hoveredPoint && (
            <div className="hidden md:block absolute left-[54%] top-[10%] -translate-x-1/2 bg-white border border-[#D9DDD7] shadow-md rounded-lg p-2.5 z-10 w-48 pointer-events-none">
              <div className="flex items-center justify-between border-b border-[#D9DDD7]/60 pb-1 mb-1.5">
                <span className="font-label-sm font-semibold text-[#181C1A]">
                  Jan 18, 2025
                </span>
                <span className="font-label-sm text-[#3F765C] bg-[#EBF3EF] px-1 rounded">
                  99.6% SLA
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between font-label-sm">
                  <span className="text-[#68716B]">Requests:</span>
                  <span className="text-[#181C1A] font-semibold">68,234 reqs</span>
                </div>
                <div className="flex justify-between font-label-sm">
                  <span className="text-[#68716B]">p95 Latency:</span>
                  <span className="text-[#181C1A] font-medium">138 ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Strip (Success, Client Error, Server Error) */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#D9DDD7]/80 divide-y md:divide-y-0 md:divide-x divide-[#D9DDD7]/80 bg-[#F1F4F1]/30 rounded-b-lg">
        <div className="p-3.5 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F765C] shrink-0" />
          <div>
            <div className="font-label-sm text-[#68716B]">Success (2xx)</div>
            <div className="font-label-md font-semibold text-[#181C1A]">
              1,821,410 <span className="text-[#3F765C] font-normal">(98.8%)</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B47A2C] shrink-0" />
          <div>
            <div className="font-label-sm text-[#68716B]">Client Error (4xx)</div>
            <div className="font-label-md font-semibold text-[#181C1A]">
              14,320 <span className="text-[#B47A2C] font-normal">(0.8%)</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B84C45] shrink-0" />
          <div>
            <div className="font-label-sm text-[#68716B]">Server Error (5xx)</div>
            <div className="font-label-md font-semibold text-[#181C1A]">
              6,561 <span className="text-[#B84C45] font-normal">(0.4%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
