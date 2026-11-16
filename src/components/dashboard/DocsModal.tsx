import React, { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Code: React.FC<{ children: ReactNode; tone?: "default" | "danger" }> = ({
  children,
  tone = "default",
}) => (
  <code
    className={cn(
      "rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs",
      tone === "danger" ? "text-danger" : "text-text-primary",
    )}
  >
    {children}
  </code>
);

const TELEMETRY_HEADERS = [
  {
    name: "X-Request-ID",
    hint: "UUIDv4",
    description: "Unique trace identifier for the request.",
  },
  {
    name: "X-Gateway-Latency",
    hint: "milliseconds",
    description: "Total edge transit duration.",
  },
  {
    name: "X-Edge-Node",
    hint: "region",
    description: "Active ingress cluster node region.",
  },
] as const;

const BREAKER_RULES: { label: string; value: ReactNode }[] = [
  { label: "Threshold", value: <Code>1,800 ms</Code> },
  { label: "Trigger", value: <>More than 5 consecutive probes</> },
  { label: "Action", value: <>Node is isolated temporarily</> },
  {
    label: "Response",
    value: (
      <>
        <Code tone="danger">503</Code>
        <span className="ml-1.5">
          Service Unavailable, with backoff headers
        </span>
      </>
    ),
  },
];

const REQUEST_FLOW = [
  { title: "Ingress", description: "Request enters the edge cluster." },
  { title: "Telemetry", description: "Gateway attaches trace metadata." },
  {
    title: "Upstream",
    description: "Request is forwarded to the service node.",
  },
] as const;

const SectionHeading: React.FC<{
  id: string;
  title: string;
  description: string;
}> = ({ id, title, description }) => (
  <div className="mb-3">
    <h3 id={id} className="text-sm font-semibold text-text-primary">
      {title}
    </h3>
    <p className="mt-1 text-xs leading-5 text-text-secondary">{description}</p>
  </div>
);

const CopyName: React.FC<{
  name: string;
  copied: boolean;
  onCopy: (name: string) => void;
}> = ({ name, copied, onCopy }) => (
  <button
    type="button"
    onClick={() => onCopy(name)}
    aria-label={`Copy ${name}`}
    className="group inline-flex min-h-8 max-w-full items-center gap-2 rounded-md text-left font-mono text-xs font-medium text-text-primary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
  >
    <span className="truncate">{name}</span>
    {copied ? (
      <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
    ) : (
      <Copy
        className="h-3.5 w-3.5 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-60"
        aria-hidden="true"
      />
    )}
  </button>
);

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCopied(null);
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    }
  }, [isOpen]);

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);

      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        setCopied(null);
        timer.current = null;
      }, 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Gateway Documentation"
      description="Quick reference for ingress routing, telemetry, and gateway behavior."
      footer={
        <div className="flex w-full justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Telemetry Headers */}
        <section aria-labelledby="telemetry-headers">
          <SectionHeading
            id="telemetry-headers"
            title="Telemetry headers"
            description="Every request passing through the edge cluster receives these headers in its upstream response."
          />

          <dl className="divide-y divide-border-default border-y border-border-default">
            {TELEMETRY_HEADERS.map((header) => (
              <div
                key={header.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-3 sm:grid-cols-[190px_minmax(0,1fr)_auto]"
              >
                <dt className="min-w-0">
                  <CopyName
                    name={header.name}
                    copied={copied === header.name}
                    onCopy={handleCopy}
                  />
                </dt>

                <dd className="col-start-1 row-start-2 min-w-0 text-xs leading-5 text-text-secondary sm:col-start-2 sm:row-start-1">
                  {header.description}
                </dd>

                <dd className="col-start-2 row-span-2 row-start-1 font-mono text-[11px] text-text-secondary sm:col-start-3 sm:row-span-1">
                  {header.hint}
                </dd>
              </div>
            ))}
          </dl>

          <p className="sr-only" role="status" aria-live="polite">
            {copied ? `${copied} copied` : ""}
          </p>
        </section>

        {/* Circuit Breaker */}
        <section aria-labelledby="circuit-breaker">
          <SectionHeading
            id="circuit-breaker"
            title="Circuit breaker"
            description="The gateway temporarily isolates an upstream node when its failure threshold is breached."
          />

          <dl className="divide-y divide-border-default border-y border-border-default">
            {BREAKER_RULES.map((rule) => (
              <div
                key={rule.label}
                className="grid gap-1 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center sm:gap-4"
              >
                <dt className="text-xs text-text-secondary">{rule.label}</dt>
                <dd className="min-w-0 text-xs leading-5 text-text-primary">
                  {rule.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Request Flow */}
        <section aria-labelledby="request-flow">
          <SectionHeading
            id="request-flow"
            title="Request flow"
            description="Each request follows the same telemetry path through the gateway."
          />

          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {REQUEST_FLOW.map((step, index) => (
              <li
                key={step.title}
                className="border-t border-border-default pt-3"
              >
                <span className="font-mono text-[11px] text-text-secondary">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>

                <h4 className="mt-2 text-sm font-semibold text-text-primary">
                  {step.title}
                </h4>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Modal>
  );
};
