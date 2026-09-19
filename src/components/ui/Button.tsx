import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "surface";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
}

const variantStyles = {
  primary: "border border-accent bg-accent text-white hover:bg-accent/90",
  secondary:
    "border border-border-default bg-surface text-text-primary hover:bg-surface-muted",
  surface:
    "border border-border-default bg-surface-muted text-text-primary hover:bg-surface",
  ghost:
    "border border-transparent bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary",
  destructive:
    "border border-danger/30 bg-surface text-danger hover:bg-danger/10",
} as const;

const sizeStyles = {
  sm: "h-8 gap-1.5 px-2.5 text-[12px] leading-4",
  md: "h-9 gap-2 px-3 text-[13px] leading-[18px]",
  lg: "h-10 gap-2 px-4 text-[14px] leading-5",
  icon: "h-8 w-8 shrink-0 p-0",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "sm",
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex select-none items-center justify-center rounded font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
