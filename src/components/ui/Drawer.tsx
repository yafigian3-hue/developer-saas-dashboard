import React, { useEffect } from "react";
import { cn } from "../../lib/utils";
import { useLockBodyScroll } from "../../lib/useLockBodyScroll";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  className?: string;
  ariaLabel?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  width = "w-[420px]",
  className,
  ariaLabel = "Drawer panel",
}) => {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-[1px] z-50 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "fixed inset-y-0 right-0 z-50 max-w-full bg-white shadow-2xl border-l border-[#D9DDD7] flex flex-col transition-transform duration-300 ease-in-out",
          width,
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
};
