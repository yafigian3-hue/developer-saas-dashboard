import React, { useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/dashboard/PageHeader";
import { MetricCard } from "../components/dashboard/MetricCard";
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

  const handleToggleLiveSync = () => {
    setIsLiveSyncing((prev) => !prev);
  };

  const handleInspectTraceFromErrors = (endpointPath?: string) => {
    const matchedRequest = endpointPath
      ? requests.find((r) => r.endpoint === endpointPath)
      : undefined;

    onSelectRequest(matchedRequest ?? requests[0]);
  };

  return (
    <PageContainer>
      <PageHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        isLiveSyncing={isLiveSyncing}
        onToggleLiveSync={handleToggleLiveSync}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        <div className="min-w-0">
          <MetricCard
            title="Total Requests"
            badgeText="+12.4%"
            badgeType="positive"
            value="1,842,291"
            subtitle="vs. 1,638,401 last month"
            chartType="sparkline-up"
          />
        </div>

       
        <div className="min-w-0">
          <MetricCard
            title="Error Rate"
            badgeText="-8.1%"
            badgeType="positive"
            trend="down"
            value="0.42%"
            subtitle="SLA Target: < 1.00%"
            chartType="sparkline-down"
          />
        </div>

        <div className="min-w-0">
          <MetricCard
            title="Avg. Latency"
            badgeText="-4.3%"
            badgeType="positive"
            trend="down"
            value={
              <>
                142
                <span className="ml-1 text-base font-medium text-text-secondary">
                  ms
                </span>
              </>
            }
            subtitle={
              <span className="flex flex-wrap items-center gap-1.5">
                <span>p95: 230ms</span>
                <span className="text-border-default">•</span>
                <span className="font-medium text-warning">p99: 412ms</span>
              </span>
            }
            chartType="sparkline-latency"
          />
        </div>

        <div className="min-w-0">
          <MetricCard
            title="Active Projects"
            badgeText="+2 this month"
            badgeType="neutral"
            value="12"
            subtitle={
              <span className="flex items-center gap-1 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                12/12 passing health probes
              </span>
            }
            chartType="bars"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 min-w-0 lg:col-span-8">
          <RequestVolumeChart
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
        </div>

        <div className="col-span-12 min-w-0 lg:col-span-4">
          <ErrorsByEndpoint onInspectTrace={handleInspectTraceFromErrors} />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 min-w-0 lg:col-span-8">
          <RecentRequestsTable
            requests={requests}
            selectedRequestId={selectedRequest?.id}
            onSelectRequest={onSelectRequest}
          />
        </div>

        <div className="col-span-12 flex min-w-0 flex-col justify-between gap-6 lg:col-span-4">
          <LatencyDistribution />
          <GatewayHealth />
        </div>
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
