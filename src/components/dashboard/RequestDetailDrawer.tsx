import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Terminal,
  X,
} from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { ApiRequest } from "../../types/request";
import { cn } from "../../lib/utils";

interface RequestDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: ApiRequest | null;
  onViewLogs?: (requestId: string) => void;
}

type RequestTab = "overview" | "headers" | "payload" | "timeline";

const tabs: Array<{ id: RequestTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "headers", label: "Headers" },
  { id: "payload", label: "Payload" },
  { id: "timeline", label: "Timeline" },
];

const defaultWaterfall = {
  dns: 12,
  tls: 24,
  ttfb: 1740,
  transfer: 24,
};

const formatLatency = (latency: number): string =>
  latency >= 1000 ? `${(latency / 1000).toFixed(1)}s` : `${latency}ms`;

export const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({
  isOpen,
  onClose,
  request,
  onViewLogs,
}) => {
  const [activeTab, setActiveTab] = useState<RequestTab>("overview");
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveTab("overview");
    setCopiedCurl(false);
    setCopiedUrl(false);
  }, [request?.id]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const drawerOpen = isOpen && Boolean(request);

  const statusTone = useMemo(() => {
    if (!request) {
      return {
        icon: CheckCircle2,
        label: "",
        iconClass: "text-success",
        textClass: "text-success",
        backgroundClass: "bg-accent-soft",
        borderClass: "border-accent/20",
        badgeVariant: "success" as const,
      };
    }

    if (request.status >= 500) {
      return {
        icon: AlertCircle,
        label: "Upstream gateway connection failure",
        iconClass: "text-danger",
        textClass: "text-danger",
        backgroundClass: "bg-danger/[0.04]",
        borderClass: "border-danger/20",
        badgeVariant: "danger" as const,
      };
    }

    if (request.status >= 400) {
      return {
        icon: AlertCircle,
        label: "Client request exception",
        iconClass: "text-warning",
        textClass: "text-warning",
        backgroundClass: "bg-warning/[0.05]",
        borderClass: "border-warning/20",
        badgeVariant: "warning" as const,
      };
    }

    return {
      icon: CheckCircle2,
      label: "Upstream dispatch completed successfully",
      iconClass: "text-success",
      textClass: "text-success",
      backgroundClass: "bg-accent-soft",
      borderClass: "border-accent/20",
      badgeVariant: "success" as const,
    };
  }, [request]);

  const waterfall = request?.latencyBreakdown ?? defaultWaterfall;

  const totalTime =
    waterfall.dns + waterfall.tls + waterfall.ttfb + waterfall.transfer;

  const waterfallSegments = [
    {
      id: "dns",
      label: "DNS Lookup",
      value: waterfall.dns,
      tone: "bg-accent/35",
    },
    {
      id: "tls",
      label: "TLS Handshake",
      value: waterfall.tls,
      tone: "bg-accent/55",
    },
    {
      id: "ttfb",
      label:
        request?.status && request.status >= 500
          ? "Waiting (TTFB Timeout)"
          : "Waiting (TTFB)",
      value: waterfall.ttfb,
      tone:
        request?.status && request.status >= 500 ? "bg-danger" : "bg-accent",
    },
    {
      id: "transfer",
      label: "Response Transfer",
      value: waterfall.transfer,
      tone: "bg-accent/25",
    },
  ];

  const handleCopy = async (
    value: string,
    type: "curl" | "url",
  ): Promise<void> => {
    try {
      if (!navigator.clipboard) return;

      await navigator.clipboard.writeText(value);

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      if (type === "curl") {
        setCopiedCurl(true);
      } else {
        setCopiedUrl(true);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedCurl(false);
        setCopiedUrl(false);
        copyTimeoutRef.current = null;
      }, 1800);
    } catch {
      setCopiedCurl(false);
      setCopiedUrl(false);
    }
  };

  const handleCopyCurl = () => {
    if (!request) return;

    const curl = `curl -X ${request.method} "${request.url}" \\
  -H "Authorization: Bearer [REDACTED]" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: ${request.id}"`;

    void handleCopy(curl, "curl");
  };

  const handleCopyUrl = () => {
    if (!request) return;
    void handleCopy(request.url, "url");
  };

  if (!request) return null;

  const StatusIcon = statusTone.icon;

  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={onClose}
      width="w-full sm:w-[440px] md:w-[480px]"
    >
      <div className="flex h-full min-h-0 flex-col bg-surface">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border-default px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-muted text-accent">
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold tracking-tight text-text-primary">
                Request Details
              </h2>
              <code className="mt-0.5 block truncate font-code-inline text-[10px] text-text-secondary">
                {request.id}
              </code>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close request details"
            className="shrink-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </header>

        <section
          className={cn(
            "flex shrink-0 items-start justify-between gap-4 border-b px-4 py-3.5 sm:px-5",
            statusTone.backgroundClass,
            statusTone.borderClass,
          )}
          aria-label="Request status"
        >
          <div className="flex min-w-0 items-start gap-2.5">
            <StatusIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", statusTone.iconClass)}
              aria-hidden="true"
            />

            <div className="min-w-0">
              <div className={cn("font-label-md", statusTone.textClass)}>
                {request.status} {request.statusText}
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-text-secondary">
                {statusTone.label}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div
              className={cn(
                "font-code-inline font-semibold",
                statusTone.textClass,
              )}
            >
              {formatLatency(request.latency)}
            </div>
            <div className="mt-0.5 font-label-sm text-text-secondary">
              {request.utcDate}
            </div>
          </div>
        </section>

        <nav
          aria-label="Request detail sections"
          className="flex shrink-0 overflow-x-auto border-b border-border-default bg-surface-muted/40 px-3 sm:px-4"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 border-b-2 px-2.5 py-2.5 font-label-sm capitalize transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-5">
            {activeTab === "overview" && (
              <>
                <section aria-labelledby="latency-title">
                  <div className="mb-3">
                    <h3
                      id="latency-title"
                      className="font-label-sm font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Latency Breakdown
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {waterfallSegments.map((segment) => {
                      const percentage = totalTime
                        ? Math.max(
                            2,
                            Math.round((segment.value / totalTime) * 100),
                          )
                        : 0;

                      const isTimeout =
                        segment.id === "ttfb" && request.status >= 500;

                      return (
                        <div key={segment.id}>
                          <div
                            className={cn(
                              "mb-1 flex items-center justify-between gap-3 font-label-sm",
                              isTimeout ? "text-danger" : "text-text-secondary",
                            )}
                          >
                            <span>{segment.label}</span>
                            <span className="shrink-0 font-code-inline">
                              {segment.value.toLocaleString()}ms
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-sm bg-surface-muted">
                            <div
                              className={cn(
                                "h-full rounded-sm transition-[width] duration-200",
                                segment.tone,
                              )}
                              style={{ width: `${percentage}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section aria-labelledby="request-url-title">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3
                      id="request-url-title"
                      className="font-label-sm font-semibold uppercase tracking-wide text-text-secondary"
                    >
                      Request URL
                    </h3>

                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex shrink-0 items-center gap-1 font-label-sm text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      {copiedUrl ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-md border border-border-default bg-surface-muted px-3 py-2.5 font-code-inline leading-5 text-text-primary break-all select-all">
                    {request.url}
                  </div>
                </section>

                {request.errorSummary && (
                  <section aria-labelledby="error-summary-title">
                    <h3
                      id="error-summary-title"
                      className="mb-2 font-label-sm font-semibold uppercase tracking-wide text-danger"
                    >
                      Error Trace Summary
                    </h3>

                    <div className="rounded-md border border-danger/20 bg-danger/[0.04] px-3 py-2.5 font-code-inline leading-5 text-danger break-words select-all">
                      {request.errorSummary}
                    </div>
                  </section>
                )}

                <section
                  aria-label="Request metadata"
                  className="border-t border-border-default pt-4"
                >
                  <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <dt className="font-label-sm text-text-secondary">
                        Client IP
                      </dt>
                      <dd className="mt-1 break-all font-code-inline font-medium text-text-primary">
                        {request.clientIp}
                      </dd>
                    </div>

                    <div className="min-w-0">
                      <dt className="font-label-sm text-text-secondary">
                        Region / Provider
                      </dt>
                      <dd className="mt-1 break-words text-[12px] font-medium text-text-primary">
                        {request.region}
                      </dd>
                    </div>

                    <div className="min-w-0">
                      <dt className="font-label-sm text-text-secondary">
                        Protocol
                      </dt>
                      <dd className="mt-1 break-words font-code-inline text-text-primary">
                        {request.protocol}
                      </dd>
                    </div>

                    <div className="min-w-0">
                      <dt className="font-label-sm text-text-secondary">
                        TLS Version
                      </dt>
                      <dd className="mt-1 break-words font-code-inline text-text-primary">
                        {request.tlsVersion}
                      </dd>
                    </div>
                  </dl>
                </section>
              </>
            )}

            {activeTab === "headers" && (
              <section aria-labelledby="headers-title">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3
                    id="headers-title"
                    className="font-label-sm font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    Request Headers
                  </h3>

                  <Badge variant={statusTone.badgeVariant} fontFamily="mono">
                    {Object.keys(request.headers ?? {}).length} headers
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-md border border-border-default bg-surface-muted p-3">
                  {request.headers &&
                  Object.keys(request.headers).length > 0 ? (
                    <div className="space-y-2.5">
                      {Object.entries(request.headers).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid gap-1 sm:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.5fr)] sm:gap-3"
                        >
                          <span className="break-all font-code-inline font-medium text-accent">
                            {key}
                          </span>
                          <span className="break-all font-code-inline text-text-primary">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-code-inline text-[11px] text-text-secondary">
                      No custom headers recorded.
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "payload" && (
              <section aria-labelledby="payload-title">
                <div className="mb-3">
                  <h3
                    id="payload-title"
                    className="font-label-sm font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    Request Payload
                  </h3>
                </div>

                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-border-default bg-surface-muted p-3 font-code-inline leading-5 text-text-primary">
                  {request.payload || "// No request body"}
                </pre>
              </section>
            )}

            {activeTab === "timeline" && (
              <section aria-labelledby="timeline-title">
                <div className="mb-4">
                  <h3
                    id="timeline-title"
                    className="font-label-sm font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    Execution Timeline
                  </h3>
                </div>

                <div className="ml-2 border-l border-border-default pl-5">
                  {(
                    request.timeline ?? [
                      {
                        time: "0ms",
                        phase: "Ingress",
                        durationMs: 5,
                        status: "ok",
                      },
                      {
                        time: "5ms",
                        phase: "Backend Proxy",
                        durationMs: request.latency,
                        status: request.status >= 500 ? "error" : "ok",
                      },
                    ]
                  ).map((event, index) => {
                    const eventColor =
                      event.status === "error"
                        ? "bg-danger"
                        : event.status === "warn"
                          ? "bg-warning"
                          : "bg-accent";

                    return (
                      <div
                        key={`${event.phase}-${index}`}
                        className="relative pb-5 last:pb-0"
                      >
                        <span
                          className={cn(
                            "absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
                            eventColor,
                          )}
                          aria-hidden="true"
                        />

                        <div className="flex min-w-0 items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-text-primary">
                              {event.phase}
                            </div>

                            {event.details && (
                              <p className="mt-0.5 break-words font-code-inline text-[11px] leading-4 text-text-secondary">
                                {event.details}
                              </p>
                            )}
                          </div>

                          <span className="shrink-0 font-code-inline text-[11px] text-text-secondary">
                            {event.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 gap-2 border-t border-border-default bg-surface px-4 py-3 sm:px-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyCurl}
            className="min-w-0 flex-1"
          >
            {copiedCurl ? (
              <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="truncate">
              {copiedCurl ? "Copied" : "Copy cURL"}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewLogs?.(request.id)}
            disabled={!onViewLogs}
            className="min-w-0 flex-1"
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">View Logs</span>
          </Button>
        </footer>
      </div>
    </Drawer>
  );
};
