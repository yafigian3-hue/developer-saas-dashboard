import React from "react";
import { AlertTriangle } from "lucide-react";
import { endpointErrors } from "../../data/dashboard";
import { cn } from "../../lib/utils";

interface ErrorsByEndpointProps {
  onInspectTrace: () => void;
  onSelectEndpoint?: (path: string) => void;
}

export const ErrorsByEndpoint: React.FC<ErrorsByEndpointProps> = ({
  onInspectTrace,
  onSelectEndpoint,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#D9DDD7] shadow-sm p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#D9DDD7]/80 mb-4">
          <div>
            <h2 className="text-[16px] text-[#181C1A] font-semibold tracking-tight">
              Errors by Endpoint
            </h2>
            <span className="font-label-sm text-[#68716B]">
              Top failure sources (30d)
            </span>
          </div>
          <span className="font-label-sm text-[#68716B] bg-[#ECEFEB] px-2 py-0.5 rounded">
            6,561 events
          </span>
        </div>

        <div className="space-y-4">
          {endpointErrors.map((item) => {
            const is5xx = item.statusCode >= 500;
            const colorClass = is5xx ? "text-[#B84C45]" : "text-[#B47A2C]";
            const barBgClass = is5xx ? "bg-[#B84C45]" : "bg-[#B47A2C]";

            return (
              <div
                key={item.path}
                className="cursor-pointer group"
                onClick={() => onSelectEndpoint && onSelectEndpoint(item.path)}
              >
                <div className="flex items-center justify-between font-label-sm mb-1.5">
                  <span className="font-code-inline text-[#181C1A] font-medium truncate max-w-[210px] group-hover:text-[#265344] transition-colors">
                    {item.path}
                  </span>
                  <span className={cn(colorClass, "font-semibold")}>
                    {item.percentage}% ({item.statusCode})
                  </span>
                </div>
                <div className="w-full bg-[#ECEFEB] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn(barBgClass, "h-1.5 rounded-full transition-all duration-500")}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Callout at card bottom */}
      <div className="mt-4 pt-3.5 border-t border-[#D9DDD7]/60 flex items-center justify-between text-[#68716B] font-label-sm">
        <span className="flex items-center gap-1.5 text-[#414945] font-medium">
          <AlertTriangle className="w-[15px] h-[15px] text-[#B84C45]" />
          Checkout timeout elevated
        </span>
        <button
          type="button"
          onClick={onInspectTrace}
          className="text-[#265344] hover:underline font-medium hover:text-[#181C1A] transition-colors"
        >
          Inspect Trace
        </button>
      </div>
    </div>
  );
};
