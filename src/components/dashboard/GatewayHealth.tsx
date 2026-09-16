import React from "react";
import { gatewayEdgeNodes } from "../../data/dashboard";

export const GatewayHealth: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#D9DDD7] shadow-sm p-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DDD7]/60 mb-3">
          <span className="font-label-sm uppercase tracking-wider text-[#58605B] font-semibold">
            Gateway Edge Status
          </span>
          <span className="font-label-sm text-[#3F765C] bg-[#EBF3EF] px-1.5 py-0.5 rounded font-medium">
            All Healthy
          </span>
        </div>

        <div className="space-y-2.5">
          {gatewayEdgeNodes.map((node) => (
            <div
              key={node.region}
              className="flex items-center justify-between text-[12px]"
            >
              <span className="text-[#58605B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#265344]" />
                {node.region} ({node.location})
              </span>
              <span className="font-code-inline text-[#181C1A]">
                {node.latencyMs}ms
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#D9DDD7]/60 flex items-center justify-between font-label-sm text-[#58605B] mt-3">
        <span>Active ingress proxies</span>
        <span className="font-code-inline text-[#181C1A] font-semibold">
          18 / 18
        </span>
      </div>
    </div>
  );
};
