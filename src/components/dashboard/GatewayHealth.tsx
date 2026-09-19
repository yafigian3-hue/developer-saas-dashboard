import React from "react";
import { gatewayEdgeNodes } from "../../data/dashboard";
import { Badge } from "../ui/Badge";

export const GatewayHealth: React.FC = () => {
  return (
    <section className="flex h-full min-w-0 flex-col rounded-lg border border-border-default bg-surface p-4 sm:p-5">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border-default pb-3.5">
          <h2 className="min-w-0 truncate font-label-sm font-semibold uppercase tracking-wider text-text-secondary">
            Gateway Edge Status
          </h2>

          <Badge
            variant="success"
            fontFamily="mono"
            size="sm"
            className="shrink-0"
          >
            All Healthy
          </Badge>
        </div>

        <ul className="mt-3 divide-y divide-border-default/60">
          {gatewayEdgeNodes.map((node) => (
            <li
              key={node.region}
              className="flex min-w-0 items-center justify-between gap-4 py-2.5 text-[12px]"
            >
              <span className="flex min-w-0 items-center gap-2 text-text-secondary">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                  aria-hidden="true"
                />

                <span className="truncate">
                  {node.region} ({node.location})
                </span>
              </span>

              <span className="shrink-0 font-code-inline text-text-primary">
                {node.latencyMs}ms
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-default pt-3.5">
        <span className="text-[12px] text-text-secondary">
          Active ingress proxies
        </span>

        <span className="shrink-0 font-code-inline font-semibold text-text-primary">
          18 / 18
        </span>
      </div>
    </section>
  );
};
