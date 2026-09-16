import React, { useState } from "react";
import {
  Code2,
  X,
  AlertCircle,
  Copy,
  Terminal,
  Check,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Drawer } from "../ui/Drawer";
import type { ApiRequest } from "../../types/request";
import { cn } from "../../lib/utils";

export interface RequestDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: ApiRequest | null;
  onViewLogs?: (requestId: string) => void;
}

export const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({
  isOpen,
  onClose,
  request,
  onViewLogs,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "headers" | "payload" | "timeline">(
    "overview"
  );
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!request) return null;

  const is5xx = request.status >= 500;
  const is4xx = request.status >= 400 && request.status < 500;
  const is2xx = request.status < 400;

  const handleCopyCurl = () => {
    const curl = `curl -X ${request.method} "${request.url}" \\\n  -H "Authorization: Bearer [REDACTED]" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Request-ID: ${request.id}"`;
    navigator.clipboard?.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(request.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const waterfall = request.latencyBreakdown || {
    dns: 12,
    tls: 24,
    ttfb: 1740,
    transfer: 24,
  };

  const totalTime = waterfall.dns + waterfall.tls + waterfall.ttfb + waterfall.transfer;
  const dnsPct = Math.max(2, Math.round((waterfall.dns / totalTime) * 100));
  const tlsPct = Math.max(2, Math.round((waterfall.tls / totalTime) * 100));
  const ttfbPct = Math.max(2, Math.round((waterfall.ttfb / totalTime) * 100));
  const transferPct = Math.max(2, Math.round((waterfall.transfer / totalTime) * 100));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="w-full sm:w-[440px] md:w-[460px]">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#D9DDD7]/80 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <Code2 className="w-[18px] h-[18px] text-[#265344]" />
          <h3 className="text-[16px] text-[#181C1A] font-semibold tracking-tight">
            Request Details
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-code-inline text-[#68716B] bg-[#ECEFEB] px-2 py-0.5 rounded">
            {request.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-7 h-7 rounded flex items-center justify-center text-[#68716B] hover:text-[#181C1A] hover:bg-[#ECEFEB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Status Banner */}
      <div
        className={cn(
          "p-4 border-b flex items-center justify-between shrink-0",
          is5xx
            ? "bg-[#FDF4F4] border-[#F0C4C1]"
            : is4xx
            ? "bg-[#FBF5ED] border-[#EED8B8]"
            : "bg-[#EBF3EF] border-[#C6DFD3]"
        )}
      >
        <div className="flex items-center gap-2.5">
          {is5xx ? (
            <AlertCircle className="w-5 h-5 text-[#B84C45] shrink-0" />
          ) : is4xx ? (
            <AlertCircle className="w-5 h-5 text-[#B47A2C] shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#3F765C] shrink-0" />
          )}
          <div>
            <div
              className={cn(
                "font-label-md font-semibold",
                is5xx
                  ? "text-[#B84C45]"
                  : is4xx
                  ? "text-[#B47A2C]"
                  : "text-[#3F765C]"
              )}
            >
              {request.status} {request.statusText}
            </div>
            <div className="font-label-sm text-[#68716B]">
              {is5xx
                ? "Upstream gateway connection failure"
                : is4xx
                ? "Client request exception"
                : "Upstream dispatch completed successfully"}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "font-code-inline font-semibold block",
              is5xx
                ? "text-[#B84C45]"
                : is4xx
                ? "text-[#B47A2C]"
                : "text-[#181C1A]"
            )}
          >
            {request.latency >= 1000
              ? `${(request.latency / 1000).toFixed(1)}s`
              : `${request.latency}ms`}
          </span>
          <span className="font-label-sm text-[#68716B]">
            {request.utcDate}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#D9DDD7]/80 px-4 bg-[#F1F4F1]/50 shrink-0">
        {(["overview", "headers", "payload", "timeline"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "py-2 px-2.5 font-label-sm capitalize transition-colors",
                isActive
                  ? "font-semibold text-[#265344] border-b-2 border-[#265344]"
                  : "text-[#68716B] hover:text-[#181C1A]"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Scrollable Drawer Content */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1">
        {activeTab === "overview" && (
          <>
            {/* Latency Waterfall Breakdown */}
            <div>
              <div className="font-label-sm uppercase tracking-wider text-[#58605B] mb-2.5 font-semibold">
                Latency Waterfall Breakdown
              </div>
              <div className="space-y-2.5 font-label-sm">
                <div>
                  <div className="flex items-center justify-between text-[#68716B] mb-1">
                    <span>DNS Lookup</span>
                    <span className="font-code-inline">{waterfall.dns}ms</span>
                  </div>
                  <div className="w-full bg-[#ECEFEB] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#265344]/50 h-full rounded-full"
                      style={{ width: `${dnsPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[#68716B] mb-1">
                    <span>TLS Handshake</span>
                    <span className="font-code-inline">{waterfall.tls}ms</span>
                  </div>
                  <div className="w-full bg-[#ECEFEB] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#265344]/70 h-full rounded-full"
                      style={{ width: `${tlsPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    className={cn(
                      "flex items-center justify-between mb-1 font-medium",
                      is5xx ? "text-[#B84C45]" : "text-[#181C1A]"
                    )}
                  >
                    <span>
                      {is5xx ? "Waiting (TTFB Timeout)" : "Waiting (TTFB)"}
                    </span>
                    <span className="font-code-inline">
                      {waterfall.ttfb.toLocaleString()}ms
                    </span>
                  </div>
                  <div className="w-full bg-[#ECEFEB] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        is5xx ? "bg-[#B84C45]" : "bg-[#265344]"
                      )}
                      style={{ width: `${ttfbPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[#68716B] mb-1">
                    <span>Response Transfer</span>
                    <span className="font-code-inline">{waterfall.transfer}ms</span>
                  </div>
                  <div className="w-full bg-[#ECEFEB] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#265344]/40 h-full rounded-full"
                      style={{ width: `${transferPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Request URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[#58605B] uppercase font-semibold">
                  Request URL
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="font-label-sm text-[#265344] hover:underline inline-flex items-center gap-1"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 bg-[#F1F4F1] rounded border border-[#C0C8C3]/50 font-code-inline text-[#181C1A] break-all select-all">
                {request.url}
              </div>
            </div>

            {/* Error Trace Summary */}
            {request.errorSummary && (
              <div className="space-y-1.5">
                <span className="font-label-sm text-[#B84C45] uppercase font-semibold">
                  Error Trace Summary
                </span>
                <div className="p-3 bg-[#FDF4F4] rounded border border-[#F0C4C1] font-code-inline text-[#B84C45] text-[11px] leading-relaxed select-all">
                  {request.errorSummary}
                </div>
              </div>
            )}

            {/* Metadata Key-Value pairs */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D9DDD7]/60 font-label-sm">
              <div>
                <span className="text-[#68716B] block">Client IP</span>
                <span className="font-code-inline text-[#181C1A] font-medium">
                  {request.clientIp}
                </span>
              </div>
              <div>
                <span className="text-[#68716B] block">Region / Provider</span>
                <span className="text-[#181C1A] font-medium">
                  {request.region}
                </span>
              </div>
              <div>
                <span className="text-[#68716B] block">Protocol</span>
                <span className="font-code-inline text-[#181C1A]">
                  {request.protocol}
                </span>
              </div>
              <div>
                <span className="text-[#68716B] block">TLS Version</span>
                <span className="font-code-inline text-[#181C1A]">
                  {request.tlsVersion}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Headers Tab */}
        {activeTab === "headers" && (
          <div className="space-y-3 font-mono text-[11px]">
            <div className="text-[#58605B] font-sans font-semibold uppercase text-xs">
              Request Headers
            </div>
            <div className="bg-[#F0F1EE] p-3 rounded border border-[#D9DDD7] space-y-2">
              {request.headers ? (
                Object.entries(request.headers).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:gap-2 break-all">
                    <span className="text-[#265344] font-medium">{key}:</span>
                    <span className="text-[#181C1A]">{value}</span>
                  </div>
                ))
              ) : (
                <div className="text-[#68716B]">No custom headers recorded.</div>
              )}
            </div>
          </div>
        )}

        {/* Payload Tab */}
        {activeTab === "payload" && (
          <div className="space-y-3 font-mono text-[11px]">
            <div className="text-[#58605B] font-sans font-semibold uppercase text-xs">
              Request Payload / Body
            </div>
            <div className="p-3 bg-[#F0F1EE] rounded border border-[#D9DDD7] overflow-x-auto text-[#181C1A] whitespace-pre font-code-inline">
              {request.payload || `// No request body`}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="space-y-3 font-label-sm">
            <div className="text-[#58605B] font-sans font-semibold uppercase text-xs">
              Execution Timeline
            </div>
            <div className="space-y-2 relative border-l-2 border-[#D9DDD7] ml-2 pl-4 py-1">
              {(request.timeline || [
                { time: "0ms", phase: "Ingress", durationMs: 5, status: "ok" },
                { time: "5ms", phase: "Backend Proxy", durationMs: request.latency, status: is5xx ? "error" : "ok" },
              ]).map((evt, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={cn(
                      "absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white",
                      evt.status === "error"
                        ? "bg-[#B84C45]"
                        : evt.status === "warn"
                        ? "bg-[#B47A2C]"
                        : "bg-[#265344]"
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#181C1A]">{evt.phase}</span>
                    <span className="font-code-inline text-[#68716B]">{evt.time}</span>
                  </div>
                  {evt.details && (
                    <div className="text-[11px] text-[#68716B] font-mono mt-0.5">
                      {evt.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Sticky Action Footer */}
      <div className="p-4 border-t border-[#D9DDD7]/80 bg-white flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={handleCopyCurl}
          className="flex-1 py-2 px-3 rounded-lg bg-[#F1F4F1] hover:bg-[#ECEFEB] border border-[#C0C8C3]/50 text-[#181C1A] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          {copiedCurl ? (
            <>
              <Check className="w-4 h-4 text-[#3F765C]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#58605B]" />
              <span>Copy cURL</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onViewLogs && onViewLogs(request.id)}
          className="flex-1 py-2 px-3 rounded-lg bg-[#265344] hover:bg-[#1f4538] text-white text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Terminal className="w-4 h-4" />
          <span>View Logs</span>
        </button>
      </div>
    </Drawer>
  );
};
