import React from "react";
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
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start justify-between gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="text-[13px] font-medium text-[#181C1A]">{label}</div>
          )}
          {description && (
            <div className="text-[12px] text-[#68716B] mt-0.5">{description}</div>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6B5B] focus-visible:ring-offset-2",
          checked ? "bg-[#265344]" : "bg-[#C0C8C3]"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
};
