import React, { useId } from "react";
import { cn } from "../../lib/utils";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}) => {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const labelId = `${toggleId}-label`;
  const descriptionId = `${toggleId}-description`;

  return (
    <div
      className={cn(
        "flex min-w-0 items-start justify-between gap-4 select-none",
        disabled && "opacity-50",
      )}
    >
      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <div
              id={labelId}
              className="text-[13px] font-medium leading-[18px] text-text-primary"
            >
              {label}
            </div>
          )}

          {description && (
            <div
              id={descriptionId}
              className="mt-0.5 text-[12px] leading-4 text-text-secondary"
            >
              {description}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
          "disabled:cursor-not-allowed",
          checked
            ? "border-accent bg-accent"
            : "border-border-default bg-surface-muted",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "block h-4 w-4 rounded-full border border-border-default bg-surface transition-transform duration-150",
            checked ? "translate-x-[16px]" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
};
