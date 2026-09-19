import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "primary"
    | "outline";
  fontFamily?: "mono" | "sans";
  size?: "sm" | "md";
}

const variantStyles = {
  neutral: "border-border-default bg-surface-muted text-text-secondary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  primary: "border-accent/30 bg-accent-soft text-accent",
  outline: "border-border-default bg-transparent text-text-secondary",
} as const;

const fontStyles = {
  mono: "font-label-sm",
  sans: "font-sans text-[11px] leading-[14px]",
} as const;

const sizeStyles = {
  sm: "px-1.5 py-0.5",
  md: "px-2 py-1 text-xs leading-4",
} as const;

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  fontFamily = "mono",
  size = "sm",
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded border font-medium",
        variantStyles[variant],
        fontStyles[fontFamily],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
