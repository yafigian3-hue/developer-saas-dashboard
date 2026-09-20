import React from "react";
import { BookOpen } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Gateway Documentation"
      description="Quick reference guide for ingress proxy routing, telemetry, and headers."
      footer={
        <div className="flex w-full justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Documentation
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 border-b border-border-default pb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-muted text-accent">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="font-label-sm uppercase tracking-wide text-text-secondary">
              Quick Reference
            </p>
            <p className="mt-1 text-[12px] leading-5 text-text-secondary">
              Reference the headers and gateway behavior used by your edge
              infrastructure.
            </p>
          </div>
        </div>

        <section aria-labelledby="telemetry-headers">
          <div className="mb-3">
            <h3
              id="telemetry-headers"
              className="text-[13px] font-semibold text-text-primary"
            >
              Standard Telemetry Headers
            </h3>
            <p className="mt-1 text-[12px] leading-5 text-text-secondary">
              Every ingress request processed through the edge cluster
              automatically annotates upstream responses with these headers:
            </p>
          </div>

          <dl className="divide-y divide-border-default overflow-hidden rounded-md border border-border-default bg-surface">
            <div className="grid gap-1 px-3 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="min-w-0 font-code-inline font-medium text-accent">
                X-Request-ID
              </dt>
              <dd className="min-w-0 text-[12px] leading-5 text-text-secondary">
                Unique UUIDv4 trace identifier
              </dd>
            </div>

            <div className="grid gap-1 px-3 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="min-w-0 font-code-inline font-medium text-accent">
                X-Gateway-Latency
              </dt>
              <dd className="min-w-0 text-[12px] leading-5 text-text-secondary">
                Total edge transit duration (ms)
              </dd>
            </div>

            <div className="grid gap-1 px-3 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
              <dt className="min-w-0 font-code-inline font-medium text-accent">
                X-Edge-Node
              </dt>
              <dd className="min-w-0 text-[12px] leading-5 text-text-secondary">
                Active ingress cluster node region
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="circuit-breaker">
          <div className="mb-3">
            <h3
              id="circuit-breaker"
              className="text-[13px] font-semibold text-text-primary"
            >
              Circuit Breaker Semantics
            </h3>
            <p className="mt-1 text-[12px] leading-5 text-text-secondary">
              The gateway temporarily isolates an upstream node when the
              configured failure threshold is breached.
            </p>
          </div>

          <div className="rounded-md border border-border-default bg-surface-muted px-3 py-3">
            <p className="text-[12px] leading-5 text-text-primary">
              When an upstream service breaches{" "}
              <code className="font-code-inline text-accent">1,800ms</code> for
              &gt;5 consecutive probes, the gateway temporarily isolates the
              node and returns{" "}
              <code className="font-code-inline text-danger">HTTP 503</code>{" "}
              <span className="font-medium">Service Unavailable</span> with
              backoff headers.
            </p>
          </div>
        </section>

        <section aria-labelledby="request-flow">
          <div className="mb-3">
            <h3
              id="request-flow"
              className="text-[13px] font-semibold text-text-primary"
            >
              Request Flow
            </h3>
            <p className="mt-1 text-[12px] leading-5 text-text-secondary">
              Requests passing through the gateway follow the same telemetry
              path:
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-md border border-border-default bg-surface px-3 py-2.5">
              <div className="font-label-sm text-text-secondary">01</div>
              <div className="mt-1 text-[12px] font-medium text-text-primary">
                Ingress
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">
                Request enters the edge cluster.
              </p>
            </div>

            <div className="rounded-md border border-border-default bg-surface px-3 py-2.5">
              <div className="font-label-sm text-text-secondary">02</div>
              <div className="mt-1 text-[12px] font-medium text-text-primary">
                Telemetry
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">
                Gateway attaches trace metadata.
              </p>
            </div>

            <div className="rounded-md border border-border-default bg-surface px-3 py-2.5">
              <div className="font-label-sm text-text-secondary">03</div>
              <div className="mt-1 text-[12px] font-medium text-text-primary">
                Upstream
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">
                Request is forwarded to the service node.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};
