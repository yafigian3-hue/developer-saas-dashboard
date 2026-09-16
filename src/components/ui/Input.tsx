import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#68716B] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-8 bg-[#F1F4F1] border border-[#C0C8C3]/50 rounded-lg text-[12px] leading-4 text-[#181C1A] placeholder:text-[#68716B] focus:outline-none focus:border-[#3F6B5B] focus:bg-white transition-all",
            icon ? "pl-9" : "pl-3",
            rightElement ? "pr-8" : "pr-3",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#68716B] flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
