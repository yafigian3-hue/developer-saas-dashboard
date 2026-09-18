import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLockBodyScroll } from "../../lib/useLockBodyScroll";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
} as const;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
}) => {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? "modal-description" : undefined}
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg border border-border-default bg-surface shadow-sm",
              maxWidthStyles[maxWidth],
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-default px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <h2
                  id="modal-title"
                  className="text-[16px] font-semibold leading-6 text-text-primary"
                >
                  {title}
                </h2>

                {description && (
                  <p
                    id="modal-description"
                    className="mt-0.5 text-[12px] leading-4 text-text-secondary"
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border-default bg-surface-muted px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
