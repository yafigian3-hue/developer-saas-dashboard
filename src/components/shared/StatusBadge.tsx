import React from "react";
import { cn } from "../../lib/utils";
import type { HttpMethod } from "../../types/request";

interface StatusBadgeProps {
  status?: number;
  text?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, className }) => {
  const displayText = text || (status ? `${status} OK` : "");

  if (status && status >= 500) {
    return (
      <span
        className={cn(
          "font-label-sm inline-flex items-center px-1.5 py-0.5 rounded bg-[#FDF4F4] text-[#B84C45] border border-[#F0C4C1] font-medium whitespace-nowrap",
          className
        )}
      >
        {displayText}
      </span>
    );
  }

  if (status && status >= 400) {
    return (
      <span
        className={cn(
          "font-label-sm inline-flex items-center px-1.5 py-0.5 rounded bg-[#FBF5ED] text-[#B47A2C] border border-[#EED8B8] font-medium whitespace-nowrap",
          className
        )}
      >
        {displayText}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-label-sm inline-flex items-center px-1.5 py-0.5 rounded bg-[#EBF3EF] text-[#3F765C] border border-[#C6DFD3] font-medium whitespace-nowrap",
        className
      )}
    >
      {displayText}
    </span>
  );
};

export const MethodBadge: React.FC<{ method: HttpMethod; className?: string }> = ({
  method,
  className,
}) => {
  const methodStyles = {
    GET: "bg-[#EBF3EF] text-[#3F765C]",
    POST: "bg-[#E0E3E0] text-[#181C1A]",
    PUT: "bg-[#EBF3EF] text-[#3F6B5B]",
    PATCH: "bg-[#FBF5ED] text-[#B47A2C]",
    DELETE: "bg-[#FDF4F4] text-[#B84C45]",
  };

  return (
    <span
      className={cn(
        "font-label-sm px-1.5 py-0.5 rounded font-semibold inline-block text-center min-w-[42px]",
        methodStyles[method] || "bg-[#E0E3E0] text-[#181C1A]",
        className
      )}
    >
      {method}
    </span>
  );
};
