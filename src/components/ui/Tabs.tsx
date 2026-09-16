import React from "react";
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

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}) => {
  if (variant === "pill") {
    return (
      <div
        className={cn(
          "inline-flex rounded-lg bg-[#F1F4F1] p-0.5 border border-[#C0C8C3]/50 text-[#68716B] font-label-sm",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-2.5 py-1 rounded transition-colors whitespace-nowrap",
                isActive
                  ? "bg-white text-[#181C1A] font-medium shadow-sm"
                  : "hover:text-[#181C1A]"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-[10px] text-[#68716B]">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex border-b border-[#D9DDD7]/80 bg-[#F1F4F1]/50 shrink-0",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "py-2 px-3 font-label-sm transition-colors whitespace-nowrap",
              isActive
                ? "font-semibold text-[#265344] border-b-2 border-[#265344]"
                : "text-[#68716B] hover:text-[#181C1A]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
