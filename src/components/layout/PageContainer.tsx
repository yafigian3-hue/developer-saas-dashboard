import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const PageContainer = ({
  children,
  className,
  ...props
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[1680px] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 xl:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
