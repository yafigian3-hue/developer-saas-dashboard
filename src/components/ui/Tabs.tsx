import React, { useRef } from "react";
import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

const tabButtonBase =
  "shrink-0 whitespace-nowrap font-label-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent";

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}) => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (!tabs.length) return;

    let nextIndex = index;

    if (variant === "underline") {
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
    } else {
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    if (!nextTab) return;

    onChange(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  if (variant === "pill") {
    return (
      <div
        role="tablist"
        className={cn(
          "inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-md border border-border-default bg-surface-muted p-0.5",
          className,
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                tabButtonBase,
                "rounded-sm px-2.5 py-1.5",
                isActive
                  ? "bg-surface text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-[10px]",
                    isActive ? "text-text-secondary" : "text-text-secondary/80",
                  )}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className={cn(
        "flex min-w-0 overflow-x-auto border-b border-border-default",
        className,
      )}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              tabButtonBase,
              "border-b-2 px-3 py-2",
              isActive
                ? "border-accent font-semibold text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span className="ml-1 text-[10px] text-text-secondary">
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
