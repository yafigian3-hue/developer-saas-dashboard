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
      className={cn("w-full px-4 sm:px-6 py-6 max-w-[1600px] mx-auto space-y-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};
