import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "surface";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "sm", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6B5B] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded select-none";

    const variantStyles = {
      primary:
        "bg-[#265344] hover:bg-[#1f4538] text-white border border-[#265344] shadow-none",
      secondary:
        "bg-white hover:bg-[#F0F1EE] text-[#161A18] border border-[#D9DDD7] shadow-sm",
      surface:
        "bg-white hover:bg-[#ECEFEB] text-[#161A18] border border-[#D9DDD7]/80 shadow-sm",
      ghost:
        "bg-transparent hover:bg-[#ECEFEB] text-[#68716B] hover:text-[#161A18]",
      destructive:
        "bg-white hover:bg-[#FDF4F4] text-[#B84C45] border border-[#B84C45]",
    };

    const sizeStyles = {
      sm: "h-8 px-2.5 text-[12px] leading-4 gap-1.5",
      md: "h-9 px-3 text-[13px] leading-[18px] gap-2",
      lg: "h-10 px-4 text-[14px] leading-5 gap-2",
      icon: "h-8 w-8 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
