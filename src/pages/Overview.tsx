import React, { useCallback, useMemo, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/dashboard/PageHeader";
import {
  MetricCard,
  type MetricCardProps,
} from "../components/dashboard/MetricCard";
import { RequestVolumeChart } from "../components/dashboard/RequestVolumeChart";
import { ErrorsByEndpoint } from "../components/dashboard/ErrorsByEndpoint";
import { RecentRequestsTable } from "../components/dashboard/RecentRequestsTable";
import { LatencyDistribution } from "../components/dashboard/LatencyDistribution";
import { GatewayHealth } from "../components/dashboard/GatewayHealth";
import { RequestDetailDrawer } from "../components/dashboard/RequestDetailDrawer";
import type { ApiRequest } from "../types/request";

export interface OverviewPageProps {
  requests: ApiRequest[];
  selectedRequest: ApiRequest | null;
  onSelectRequest: (req: ApiRequest) => void;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onViewLogs: (reqId: string) => void;
}

const buildMetrics = (): Array<MetricCardProps & { key: string }> => [
  {
    key: "total-requests",
    title: "Total Requests",
    badgeText: "12.4%",
    badgeType: "positive",
    trend: "up",
    value: "1,842,291",
    subtitle: "vs. 1,638,401 last month",
    chartType: "sparkline-up",
  },
  {
    key: "error-rate",
    title: "Error Rate",
    badgeText: "8.1%",
    badgeType: "positive",
    trend: "down",
    value: "0.42%",
    subtitle: "SLA target: < 1.00%",
    chartType: "sparkline-down",
  },
  {
    key: "avg-latency",
    title: "Avg. Latency",
    badgeText: "4.3%",
    badgeType: "positive",
    trend: "down",
    value: (
      <>
        142
        <span className="ml-1 text-base font-medium text-text-secondary">
          ms
        </span>
      </>
    ),
    subtitle: (
      <span className="flex flex-wrap items-center gap-x-1.5">
        <span>p95: 230ms</span>
        <span aria-hidden className="text-border-default">
          •
        </span>
        <span className="font-medium text-warning">p99: 412ms</span>
      </span>
    ),
    chartType: "sparkline-latency",
  },
  {
    key: "active-projects",
    title: "Active Projects",
    badgeText: "+2 this month",
    badgeType: "neutral",
    value: "12",
    subtitle: (
      <span className="flex items-center gap-1.5 text-success">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
        12/12 passing health probes
      </span>
    ),
    chartType: "bars",
  },
];

const GRID_GAP = "gap-3 sm:gap-4 xl:gap-5";

export const OverviewPage: React.FC<OverviewPageProps> = ({
  requests,
  selectedRequest,
  onSelectRequest,
  isDrawerOpen,
  onCloseDrawer,
  onViewLogs,
}) => {
  const [dateRange, setDateRange] = useState<string>("30d");
  const [environment, setEnvironment] = useState<string>("prod-cluster-01");
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);

  const metrics = useMemo(buildMetrics, []);

  const handleToggleLiveSync = useCallback(() => {
    setIsLiveSyncing((prev) => !prev);
  }, []);

  const handleInspectTraceFromErrors = useCallback(
    (endpointPath?: string) => {
      if (requests.length === 0) return;
      const matched = endpointPath
        ? requests.find((r) => r.endpoint === endpointPath)
        : undefined;
      onSelectRequest(matched ?? requests[0]);
    },
    [requests, onSelectRequest],
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-5 xl:gap-6">
        <PageHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          environment={environment}
          onEnvironmentChange={setEnvironment}
          isLiveSyncing={isLiveSyncing}
          onToggleLiveSync={handleToggleLiveSync}
        />

        {/* auto-fit: jumlah kolom menyesuaikan lebar area konten (sidebar ikut dihitung),
            bukan lebar layar, jadi tidak ada lagi layout 2x2 yang tanggung. */}
        <section
          aria-label="Ringkasan metrik"
          className={`grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] ${GRID_GAP}`}
        >
          {metrics.map(({ key, ...props }) => (
            <MetricCard key={key} {...props} />
          ))}
        </section>

        <section
          aria-label="Volume request dan error"
          className={`grid grid-cols-1 items-stretch lg:grid-cols-12 ${GRID_GAP}`}
        >
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <RequestVolumeChart
              selectedRange={dateRange}
              onRangeChange={setDateRange}
            />
          </div>
          <div className="min-w-0 lg:col-span-5 xl:col-span-4">
            <ErrorsByEndpoint onInspectTrace={handleInspectTraceFromErrors} />
          </div>
        </section>

        <section
          aria-label="Aktivitas dan kesehatan gateway"
          className={`grid grid-cols-1 items-start lg:grid-cols-12 ${GRID_GAP}`}
        >
          <div className="min-w-0 max-w-full overflow-x-auto lg:col-span-7 xl:col-span-8">
            <RecentRequestsTable
              requests={requests}
              selectedRequestId={selectedRequest?.id}
              onSelectRequest={onSelectRequest}
            />
          </div>

          <div
            className={`grid min-w-0 grid-cols-1 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1 xl:col-span-4 ${GRID_GAP}`}
          >
            <LatencyDistribution />
            <GatewayHealth />
          </div>
        </section>
      </div>

      <RequestDetailDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        request={selectedRequest}
        onViewLogs={onViewLogs}
      />
    </PageContainer>
  );
};
