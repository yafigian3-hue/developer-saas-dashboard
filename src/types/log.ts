export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogDetails {
  clientIp?: string;
  path?: string;
  statusCode?: number;
  durationMs?: number;
  host?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  requestId?: string;
  message: string;
  details?: LogDetails;
}
