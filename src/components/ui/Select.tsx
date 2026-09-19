import React, { useEffect, useId, useRef, useState } from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    setHighlightedIndex(selectedIndex);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (!options.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((current) =>
          current < options.length - 1 ? current + 1 : 0,
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((current) =>
          current > 0 ? current - 1 : options.length - 1,
        );
      }

      if (event.key === "Home") {
        event.preventDefault();
        setHighlightedIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        const option = options[highlightedIndex];

        if (option) {
          onChange(option.value);
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, highlightedIndex, onChange, options]);

  if (!selectedOption) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block min-w-0", className)}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-label={ariaLabel ?? selectedOption.label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={cn(
          "flex min-w-0 max-w-full items-center gap-2 rounded border border-border-default bg-surface px-3 py-1.5 font-label-md text-text-primary transition-colors duration-150",
          "hover:bg-surface-muted",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
          isOpen && "border-accent",
        )}
      >
        {icon && <span className="shrink-0 text-text-secondary">{icon}</span>}

        {selectedOption.indicator && (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
            aria-hidden="true"
          />
        )}

        <span className="min-w-0 truncate font-medium">
          {selectedOption.label}
        </span>

        {selectedOption.badge && (
          <span className="shrink-0 rounded border border-border-default bg-surface-muted px-1.5 py-0.5 font-label-sm text-text-secondary">
            {selectedOption.badge}
          </span>
        )}

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-150",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? "Select option"}
          className="absolute right-0 z-50 mt-1 max-h-72 min-w-[180px] max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded border border-border-default bg-surface py-1 shadow-sm"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex min-h-8 w-full items-center justify-between gap-3 px-3 py-1.5 text-left font-label-md transition-colors duration-100",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                  isHighlighted
                    ? "bg-surface-muted text-text-primary"
                    : "text-text-secondary",
                  isSelected && "font-semibold text-accent",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.indicator && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                      aria-hidden="true"
                    />
                  )}

                  <span className="truncate">{option.label}</span>
                </span>

                {option.badge && (
                  <span className="shrink-0 rounded border border-border-default bg-surface-muted px-1 py-0.5 font-label-sm text-text-secondary">
                    {option.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
