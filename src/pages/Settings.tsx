import React, { useState } from "react";
import { Save, Check, ShieldAlert, Cpu, Network, Database } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Toggle } from "../components/ui/Toggle";
import { Button } from "../components/ui/Button";

export const SettingsPage: React.FC = () => {
  const [liveStreaming, setLiveStreaming] = useState(true);
  const [tlsEnforced, setTlsEnforced] = useState(true);
  const [circuitBreaker, setCircuitBreaker] = useState(true);
  const [retentionDays, setRetentionDays] = useState("30");
  const [alertThreshold, setAlertThreshold] = useState("1.00");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-8 font-semibold text-[#181C1A] tracking-tight">
            Settings
          </h1>
          <p className="text-[13px] text-[#68716B] mt-0.5">
            Gateway telemetry, security policies, and edge routing configurations.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave}>
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved Settings</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Gateway Telemetry */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#265344]" />
              <h2 className="text-[15px] font-semibold text-[#181C1A]">
                Gateway Telemetry &amp; Ingestion
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              id="live-streaming"
              checked={liveStreaming}
              onChange={setLiveStreaming}
              label="Real-time Request Streaming"
              description="Emit millisecond latency traces and status telemetry directly to the active overview stream."
            />
            <div className="h-px bg-[#D9DDD7]/60" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[13px] font-medium text-[#181C1A]">
                  Log Retention Horizon
                </div>
                <div className="text-[12px] text-[#68716B] mt-0.5">
                  Number of days request telemetry and stack traces are persisted in cold storage.
                </div>
              </div>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="h-8 px-3 text-[12px] bg-white border border-[#D9DDD7] rounded-md font-mono focus:outline-none focus:border-[#265344]"
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days (Standard)</option>
                <option value="90">90 Days (Audit Tier)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Security & Reliability */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#265344]" />
              <h2 className="text-[15px] font-semibold text-[#181C1A]">
                Reliability &amp; Guardrails
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              id="circuit-breaker"
              checked={circuitBreaker}
              onChange={setCircuitBreaker}
              label="Automated Circuit Breakers"
              description="Automatically shed traffic and return synthetic 503s when an upstream service response exceeds 1800ms."
            />
            <div className="h-px bg-[#D9DDD7]/60" />
            <Toggle
              id="tls-enforce"
              checked={tlsEnforced}
              onChange={setTlsEnforced}
              label="Strict TLS 1.3 Cipher Negotiation"
              description="Reject legacy TLS 1.2 client handshakes across all edge ingress proxy zones."
            />
            <div className="h-px bg-[#D9DDD7]/60" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[13px] font-medium text-[#181C1A]">
                  SLA Error Rate Threshold Alert
                </div>
                <div className="text-[12px] text-[#68716B] mt-0.5">
                  Trigger high-priority alerts when global 5xx rate breaches this target.
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.05"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="h-8 w-20 px-2 text-[12px] text-right font-mono bg-white border border-[#D9DDD7] rounded-md focus:outline-none focus:border-[#265344]"
                />
                <span className="font-mono text-[12px] text-[#68716B]">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
