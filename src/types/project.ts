export type ProjectStatus = "healthy" | "degraded" | "down";

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  environment: string;
  requestsTotal: number;
  errorRate: number;
  avgLatency: number;
  healthProbesPassing: boolean;
  activeVersion: string;
  lastDeployed: string;
  description: string;
}
