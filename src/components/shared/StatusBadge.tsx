import React from "react";
import { Badge } from "../ui/Badge";
import type { BadgeProps } from "../ui/Badge";
import type { HttpMethod } from "../../types/request";

interface StatusBadgeProps {
  status?: number;
  text?: string;
  className?: string;
}

const getStatusVariant = (status?: number): BadgeProps["variant"] => {
  if (status === undefined) return "success";
  if (status >= 500) return "danger";
  if (status >= 400) return "warning";
  if (status >= 200 && status < 400) return "success";

  return "neutral";
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  className,
}) => {
  const displayText = text ?? (status !== undefined ? String(status) : "");

  if (!displayText) return null;

  return (
    <Badge variant={getStatusVariant(status)} className={className}>
      {displayText}
    </Badge>
  );
};

const methodVariants: Record<
  HttpMethod,
  Extract<
    BadgeProps["variant"],
    "neutral" | "success" | "warning" | "danger" | "primary"
  >
> = {
  GET: "success",
  POST: "neutral",
  PUT: "primary",
  PATCH: "warning",
  DELETE: "danger",
};

export const MethodBadge: React.FC<{
  method: HttpMethod;
  className?: string;
}> = ({ method, className }) => {
  return (
    <Badge
      variant={methodVariants[method] ?? "neutral"}
      className={`min-w-[42px] justify-center ${className ?? ""}`}
    >
      {method}
    </Badge>
  );
};
