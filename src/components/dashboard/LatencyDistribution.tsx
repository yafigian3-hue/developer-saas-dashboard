import React from "react";
import { Gauge } from "lucide-react";

export const LatencyDistribution: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#D9DDD7] shadow-sm p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-[16px] text-[#181C1A] font-semibold tracking-tight">
            Latency Distribution
          </h2>
          <div className="font-label-sm text-[#68716B]">Global response times</div>
        </div>
        <Gauge className="w-[18px] h-[18px] text-[#58605B]" />
      </div>

      {/* Progress segmented bar */}
      <div className="w-full h-3 rounded-full bg-[#ECEFEB] flex overflow-hidden p-0.5 gap-0.5 mb-3">
        <div
          className="bg-[#3F765C] h-full rounded-l-full transition-all duration-500"
          style={{ width: "74%" }}
          title="< 100ms (74%)"
        />
        <div
          className="bg-[#B47A2C] h-full transition-all duration-500"
          style={{ width: "21%" }}
          title="100-300ms (21%)"
        />
        <div
          className="bg-[#B84C45] h-full rounded-r-full transition-all duration-500"
          style={{ width: "5%" }}
          title="> 300ms (5%)"
        />
      </div>

      {/* 3 Metric Buckets */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-label-sm">
        <div className="p-2 rounded bg-[#F1F4F1] border border-[#D9DDD7]/60">
          <span className="text-[#68716B] block">&lt; 100ms</span>
          <span className="font-semibold text-[#3F765C]">74%</span>
        </div>
        <div className="p-2 rounded bg-[#F1F4F1] border border-[#D9DDD7]/60">
          <span className="text-[#68716B] block">100-300ms</span>
          <span className="font-semibold text-[#B47A2C]">21%</span>
        </div>
        <div className="p-2 rounded bg-[#F1F4F1] border border-[#D9DDD7]/60">
          <span className="text-[#68716B] block">&gt; 300ms</span>
          <span className="font-semibold text-[#B84C45]">5%</span>
        </div>
      </div>
    </div>
  );
};
