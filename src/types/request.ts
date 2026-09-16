export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface LatencyBreakdown {
  dns: number;
  tls: number;
  ttfb: number;
  transfer: number;
}

export interface RequestTimelineEvent {
  time: string;
  phase: string;
  durationMs: number;
  status: "ok" | "warn" | "error";
  details?: string;
}

export interface ApiRequest {
  id: string;
  time: string;
  utcDate: string;
  method: HttpMethod;
  endpoint: string;
  url: string;
  status: number;
  statusText: string;
  statusCategory: "2xx" | "4xx" | "5xx";
  latency: number;
  project: string;
  clientIp: string;
  region: string;
  protocol: string;
  tlsVersion: string;
  errorSummary?: string;
  errorDetail?: string;
  latencyBreakdown: LatencyBreakdown;
  headers?: Record<string, string>;
  payload?: string;
  timeline?: RequestTimelineEvent[];
}
