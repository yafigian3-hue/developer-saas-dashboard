import React, { useEffect, useRef, useState } from "react";
import { Check, Network, Save, ShieldAlert } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";

const retentionOptions = [
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days (Standard)" },
  { value: "90", label: "90 Days (Audit Tier)" },
] as const;

export const SettingsPage: React.FC = () => {
  const [liveStreaming, setLiveStreaming] = useState(true);
  const [tlsEnforced, setTlsEnforced] = useState(true);
  const [circuitBreaker, setCircuitBreaker] = useState(true);
  const [retentionDays, setRetentionDays] = useState("30");
  const [alertThreshold, setAlertThreshold] = useState("1.00");
  const [saved, setSaved] = useState(false);

  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    setSaved(true);

    saveTimeoutRef.current = window.setTimeout(() => {
      setSaved(false);
      saveTimeoutRef.current = null;
    }, 1800);
  };

  return (
    <PageContainer>
      {/* Page header */}
      <header className="@container">
        <div className="flex min-w-0 flex-col gap-4 @md:flex-row @md:items-end @md:justify-between">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold leading-8 tracking-tight text-text-primary">
              Settings
            </h1>

            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-text-secondary">
              Gateway telemetry, security policies, and edge routing
              configurations.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="w-full @md:w-auto"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Saved Settings</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="w-full max-w-4xl space-y-4">
        {/* Gateway telemetry */}
        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-muted">
                <Network className="h-4 w-4 text-accent" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-tight text-text-primary">
                  Gateway Telemetry &amp; Ingestion
                </h2>

                <p className="mt-0.5 text-[12px] leading-4 text-text-secondary">
                  Control request streaming and telemetry retention behavior.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border-default/60">
              {/* Live streaming */}
              <div className="py-1 first:pt-0">
                <Toggle
                  id="live-streaming"
                  checked={liveStreaming}
                  onChange={setLiveStreaming}
                  label="Real-time Request Streaming"
                  description="Emit millisecond latency traces and status telemetry directly to the active overview stream."
                />
              </div>

              {/* Retention */}
              <div className="flex min-w-0 flex-col gap-3 py-4 @md:flex-row @md:items-center @md:justify-between">
                <div className="min-w-0 @md:flex-1">
                  <div className="text-[13px] font-medium text-text-primary">
                    Log Retention Horizon
                  </div>

                  <p className="mt-0.5 max-w-2xl text-[12px] leading-5 text-text-secondary">
                    Number of days request telemetry and stack traces are
                    persisted in cold storage.
                  </p>
                </div>

                <div className="w-full shrink-0 @md:w-48">
                  <label htmlFor="retention-days" className="sr-only">
                    Log retention horizon
                  </label>

                  <select
                    id="retention-days"
                    value={retentionDays}
                    onChange={(event) => setRetentionDays(event.target.value)}
                    className={cn(
                      "h-8 w-full rounded-md border border-border-default bg-surface px-3 font-code-inline text-[12px] text-text-primary",
                      "transition-colors duration-150 hover:bg-surface-muted",
                      "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                    )}
                  >
                    {retentionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reliability */}
        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-muted">
                <ShieldAlert
                  className="h-4 w-4 text-accent"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-tight text-text-primary">
                  Reliability &amp; Guardrails
                </h2>

                <p className="mt-0.5 text-[12px] leading-4 text-text-secondary">
                  Define traffic protection and transport security policies.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border-default/60">
              {/* Circuit breaker */}
              <div className="py-1 first:pt-0">
                <Toggle
                  id="circuit-breaker"
                  checked={circuitBreaker}
                  onChange={setCircuitBreaker}
                  label="Automated Circuit Breakers"
                  description="Automatically shed traffic and return synthetic 503s when an upstream service response exceeds 1800ms."
                />
              </div>

              {/* TLS */}
              <div className="py-4">
                <Toggle
                  id="tls-enforce"
                  checked={tlsEnforced}
                  onChange={setTlsEnforced}
                  label="Strict TLS 1.3 Cipher Negotiation"
                  description="Reject legacy TLS 1.2 client handshakes across all edge ingress proxy zones."
                />
              </div>

              {/* Alert threshold */}
              <div className="flex min-w-0 flex-col gap-3 pt-4 @md:flex-row @md:items-center @md:justify-between">
                <div className="min-w-0 @md:flex-1">
                  <div className="text-[13px] font-medium text-text-primary">
                    SLA Error Rate Threshold Alert
                  </div>

                  <p className="mt-0.5 max-w-2xl text-[12px] leading-5 text-text-secondary">
                    Trigger high-priority alerts when global 5xx rate breaches
                    this target.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <label htmlFor="alert-threshold" className="sr-only">
                    SLA error rate threshold
                  </label>

                  <Input
                    id="alert-threshold"
                    type="number"
                    inputMode="decimal"
                    step="0.05"
                    min="0"
                    value={alertThreshold}
                    onChange={(event) => setAlertThreshold(event.target.value)}
                    aria-label="SLA error rate threshold"
                    className="w-24 text-right font-code-inline"
                  />

                  <span className="font-code-inline text-[12px] text-text-secondary">
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
