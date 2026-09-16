import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "primary" | "outline";
  fontFamily?: "mono" | "sans";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  fontFamily = "mono",
  size = "sm",
  children,
  ...props
}) => {
  const variantStyles = {
    neutral: "bg-[#F0F1EE] text-[#68716B] border-[#D9DDD7]",
    success: "bg-[#EBF3EF] text-[#3F765C] border-[#C6DFD3]",
    warning: "bg-[#FBF5ED] text-[#B47A2C] border-[#EED8B8]",
    danger: "bg-[#FDF4F4] text-[#B84C45] border-[#F0C4C1]",
    primary: "bg-[#E4ECE8] text-[#265344] border-[#C0C8C3]",
    outline: "bg-transparent text-[#68716B] border-[#D9DDD7]",
  };

  const fontStyles = fontFamily === "mono" ? "font-label-sm" : "font-sans text-[11px]";
  const sizeStyles = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border font-medium whitespace-nowrap",
        fontStyles,
        variantStyles[variant],
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
