import React from "react";
import { cn } from "../../lib/utils";

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "font-label-sm text-secondary uppercase tracking-wider font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
