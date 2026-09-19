import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, rightElement, ...props }, ref) => {
    const isInvalid =
      props["aria-invalid"] === true || props["aria-invalid"] === "true";

    return (
      <div className="relative flex w-full min-w-0 items-center">
        {icon && (
          <div className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-text-secondary">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          className={cn(
            "h-8 w-full min-w-0 rounded border bg-surface-muted text-[12px] leading-4 text-text-primary placeholder:text-text-secondary transition-colors duration-150",
            "border-border-default",
            "hover:border-text-secondary",
            "focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isInvalid &&
              "border-danger focus:border-danger focus:ring-danger/20",
            icon ? "pl-9" : "pl-3",
            rightElement ? "pr-9" : "pr-3",
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center text-text-secondary">
            {rightElement}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
