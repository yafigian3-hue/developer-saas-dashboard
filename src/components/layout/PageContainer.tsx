import React from "react";
import { cn } from "../../lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-[1600px] mx-auto px-4 py-6 sm:px-6 space-y-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
