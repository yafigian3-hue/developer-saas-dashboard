export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  requestId?: string;
  message: string;
  details?: Record<string, unknown>;
}
