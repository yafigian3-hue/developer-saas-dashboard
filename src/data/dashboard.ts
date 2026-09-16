export interface TimeSeriesPoint {
  date: string;
  requests: number;
  p95Latency: number;
  sla: number;
  success: number;
  clientError: number;
  serverError: number;
  isPeak?: boolean;
}

export const volumeChartData: Record<string, TimeSeriesPoint[]> = {
  "30d": [
    { date: "05 Jan", requests: 38200, p95Latency: 142, sla: 99.8, success: 37900, clientError: 220, serverError: 80 },
    { date: "09 Jan", requests: 44100, p95Latency: 139, sla: 99.7, success: 43700, clientError: 280, serverError: 120 },
    { date: "13 Jan", requests: 41800, p95Latency: 146, sla: 99.6, success: 41300, clientError: 340, serverError: 160 },
    { date: "18 Jan (Peak)", requests: 68234, p95Latency: 138, sla: 99.6, success: 67450, clientError: 510, serverError: 274, isPeak: true },
    { date: "22 Jan", requests: 52400, p95Latency: 144, sla: 99.7, success: 51800, clientError: 420, serverError: 180 },
    { date: "26 Jan", requests: 58900, p95Latency: 140, sla: 99.8, success: 58300, clientError: 440, serverError: 160 },
    { date: "30 Jan", requests: 64100, p95Latency: 136, sla: 99.9, success: 63600, clientError: 380, serverError: 120 },
  ],
  "24h": [
    { date: "00:00", requests: 2400, p95Latency: 110, sla: 99.9, success: 2385, clientError: 12, serverError: 3 },
    { date: "04:00", requests: 1800, p95Latency: 105, sla: 99.9, success: 1790, clientError: 8, serverError: 2 },
    { date: "08:00", requests: 4600, p95Latency: 128, sla: 99.7, success: 4560, clientError: 32, serverError: 8 },
    { date: "12:00", requests: 7200, p95Latency: 145, sla: 99.4, success: 7080, clientError: 78, serverError: 42 },
    { date: "16:00", requests: 6800, p95Latency: 141, sla: 99.6, success: 6720, clientError: 55, serverError: 25 },
    { date: "20:00", requests: 5100, p95Latency: 132, sla: 99.8, success: 5055, clientError: 35, serverError: 10 },
  ],
  "7d": [
    { date: "Mon", requests: 48200, p95Latency: 135, sla: 99.8, success: 47800, clientError: 310, serverError: 90 },
    { date: "Tue", requests: 52400, p95Latency: 142, sla: 99.7, success: 51950, clientError: 340, serverError: 110 },
    { date: "Wed", requests: 61000, p95Latency: 144, sla: 99.6, success: 60400, clientError: 420, serverError: 180 },
    { date: "Thu", requests: 68234, p95Latency: 138, sla: 99.6, success: 67450, clientError: 510, serverError: 274, isPeak: true },
    { date: "Fri", requests: 59300, p95Latency: 140, sla: 99.7, success: 58750, clientError: 410, serverError: 140 },
    { date: "Sat", requests: 38100, p95Latency: 122, sla: 99.9, success: 37920, clientError: 140, serverError: 40 },
    { date: "Sun", requests: 34200, p95Latency: 118, sla: 99.9, success: 34050, clientError: 120, serverError: 30 },
  ],
  "90d": [
    { date: "Nov W1", requests: 280000, p95Latency: 148, sla: 99.5, success: 277200, clientError: 2100, serverError: 700 },
    { date: "Nov W3", requests: 310000, p95Latency: 145, sla: 99.6, success: 307100, clientError: 2200, serverError: 700 },
    { date: "Dec W1", requests: 390000, p95Latency: 152, sla: 99.4, success: 385500, clientError: 3200, serverError: 1300 },
    { date: "Dec W3", requests: 440000, p95Latency: 158, sla: 99.3, success: 434200, clientError: 4100, serverError: 1700 },
    { date: "Jan W1", requests: 395000, p95Latency: 144, sla: 99.7, success: 391400, clientError: 2600, serverError: 1000 },
    { date: "Jan W3", requests: 460000, p95Latency: 138, sla: 99.7, success: 456100, clientError: 2900, serverError: 1000 },
  ],
};

export interface EndpointError {
  path: string;
  percentage: number;
  statusCode: number;
  type: "500" | "401" | "429" | "504";
}

export const endpointErrors: EndpointError[] = [
  { path: "/v1/checkout", percentage: 42, statusCode: 500, type: "500" },
  { path: "/v1/auth/tokens", percentage: 28, statusCode: 401, type: "401" },
  { path: "/v1/webhooks/stripe", percentage: 18, statusCode: 429, type: "429" },
  { path: "/v1/images/process", percentage: 12, statusCode: 504, type: "504" },
];

export interface GatewayEdgeNode {
  region: string;
  location: string;
  latencyMs: number;
  status: "healthy" | "degraded";
}

export const gatewayEdgeNodes: GatewayEdgeNode[] = [
  { region: "us-east-1", location: "N. Virginia", latencyMs: 38, status: "healthy" },
  { region: "eu-central-1", location: "Frankfurt", latencyMs: 82, status: "healthy" },
  { region: "ap-southeast-1", location: "Singapore", latencyMs: 144, status: "healthy" },
];
