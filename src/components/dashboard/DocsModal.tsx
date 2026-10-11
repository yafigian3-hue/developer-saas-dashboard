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
      "rounded bg-surface-muted px-1 py-0.5 font-mono text-[12px]",
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
        <Code tone="danger">503</Code> Service Unavailable, with backoff headers
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

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */


const SectionHeading: React.FC<{
  id: string;
  title: string;
  children: ReactNode;
}> = ({ id, title, children }) => (
  <div className="mb-3">
    <h3 id={id} className="text-[13px] font-semibold text-text-primary">
      {title}
    </h3>
    <p className="mt-1 text-[12.5px] leading-5 text-text-secondary">
      {children}
    </p>
  </div>
);

/** Nama header yang bisa disalin dengan satu klik/tap. */
const CopyName: React.FC<{
  name: string;
  copied: boolean;
  onCopy: (name: string) => void;
}> = ({ name, copied, onCopy }) => (
  <button
    type="button"
    onClick={() => onCopy(name)}
    aria-label={`Copy ${name}`}
    className="group -ml-1.5 inline-flex min-h-8 max-w-full items-center gap-2 rounded px-1.5 text-left font-mono text-[12.5px] font-medium text-text-primary outline-none transition-colors duration-150 hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-accent"
  >
    <span className="truncate">{name}</span>
    {copied ? (
      <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
    ) : (
      <Copy
        className="h-3.5 w-3.5 shrink-0 text-text-secondary opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-60"
        aria-hidden="true"
      />
    )}
  </button>
);

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* Clipboard bisa diblokir (mis. konteks tidak aman); abaikan. */
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Gateway Documentation"
      description="Quick reference for ingress proxy routing, telemetry, and headers."
      footer={
        <div className="flex w-full justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 1. Headers */}
        <section aria-labelledby="telemetry-headers">
          <SectionHeading id="telemetry-headers" title="Telemetry headers">
            Every request that passes through the edge cluster is annotated with
            these headers on the upstream response.
          </SectionHeading>

          <dl className="divide-y divide-border-default border-y border-border-default">
            {TELEMETRY_HEADERS.map((h) => (
              <div
                key={h.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 py-2 sm:grid-cols-[200px_minmax(0,1fr)_auto] sm:py-1.5"
              >
                <dt className="col-start-1 min-w-0">
                  <CopyName
                    name={h.name}
                    copied={copied === h.name}
                    onCopy={handleCopy}
                  />
                </dt>
                <dd className="col-start-1 row-start-2 min-w-0 text-[12.5px] leading-5 text-text-secondary sm:col-start-2 sm:row-start-1">
                  {h.description}
                </dd>
                <dd className="col-start-2 row-span-2 row-start-1 font-mono text-[11.5px] text-text-secondary/70 sm:col-start-3 sm:row-span-1">
                  {h.hint}
                </dd>
              </div>
            ))}
          </dl>

          {/* Pengumuman untuk pembaca layar saat berhasil menyalin */}
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? `${copied} copied` : ""}
          </p>
        </section>

        {/* 2. Circuit breaker */}
        <section aria-labelledby="circuit-breaker">
          <SectionHeading id="circuit-breaker" title="Circuit breaker">
            The gateway temporarily isolates an upstream node when its failure
            threshold is breached.
          </SectionHeading>

          <dl className="divide-y divide-border-default border-y border-border-default">
            {BREAKER_RULES.map((r) => (
              <div
                key={r.label}
                className="grid gap-0.5 py-2.5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-[12.5px] text-text-secondary">{r.label}</dt>
                <dd className="min-w-0 text-[12.5px] leading-5 text-text-primary">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 3. Request flow */}
        <section aria-labelledby="request-flow">
          <SectionHeading id="request-flow" title="Request flow">
            Every request follows the same telemetry path through the gateway.
          </SectionHeading>

          <ol className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {REQUEST_FLOW.map((step, i) => (
              <li
                key={step.title}
                className="border-t border-border-default pt-3"
              >
                <span className="font-mono text-[11.5px] text-text-secondary/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-1 text-[13px] font-medium text-text-primary">
                  {step.title}
                </div>
                <p className="mt-0.5 text-[12.5px] leading-5 text-text-secondary">
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
