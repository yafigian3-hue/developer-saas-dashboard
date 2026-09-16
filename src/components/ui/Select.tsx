import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  indicator?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  icon,
  className,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-label={ariaLabel || selectedOption.label}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#D9DDD7] shadow-sm text-[#181C1A] hover:bg-[#F7F7F5] transition-colors font-label-md"
      >
        {icon}
        {selectedOption.indicator && (
          <span className="w-2 h-2 rounded-full bg-[#265344] animate-pulse" />
        )}
        <span className="font-medium">{selectedOption.label}</span>
        {selectedOption.badge && (
          <span className="font-label-sm text-[#68716B] bg-[#ECEFEB] px-1.5 py-0.5 rounded">
            {selectedOption.badge}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-[#68716B] ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 min-w-[180px] bg-white border border-[#D9DDD7] rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-1.5 text-left font-label-md hover:bg-[#F0F1EE] transition-colors",
                option.value === value
                  ? "text-[#265344] font-semibold bg-[#E4ECE8]/50"
                  : "text-[#181C1A]"
              )}
            >
              <div className="flex items-center gap-2">
                {option.indicator && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#265344]" />
                )}
                <span>{option.label}</span>
              </div>
              {option.badge && (
                <span className="font-label-sm text-[#68716B] bg-[#ECEFEB] px-1 rounded">
                  {option.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
