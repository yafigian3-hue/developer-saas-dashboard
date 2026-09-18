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

  const handleInspectTraceFromErrors = () => {
    // Select the checkout 500 error request
    const checkoutReq =
      requests.find((r) => r.endpoint.includes("checkout")) || requests[0];
    onSelectRequest(checkoutReq);
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 min-w-0">
          <MetricCard
            title="Total Requests"
            badgeText="+12.4%"
            badgeType="positive"
            value="1,842,291"
            subtitle="vs. 1,638,401 last month"
            chartType="sparkline-up"
          />
        </div>

        {/* KPI 2: Error Rate */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 min-w-0">
          <MetricCard
            title="Error Rate"
            badgeText="-8.1%"
            badgeType="positive"
            value="0.42%"
            subtitle="SLA Target: < 1.00%"
            chartType="sparkline-down"
          />
        </div>

        {/* KPI 3: Avg Latency */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 min-w-0">
          <MetricCard
            title="Avg. Latency"
            badgeText="-4.3%"
            badgeType="positive"
            value={
              <>
                142
                <span className="text-[16px] text-[#58605B] ml-1 font-semibold">
                  ms
                </span>
              </>
            }
            subtitle={
              <span className="flex items-center gap-1.5 flex-wrap">
                <span>p95: 230ms</span>
                <span className="text-[#C0C8C3]">•</span>
                <span className="text-[#8B5706] font-medium">p99: 412ms</span>
              </span>
            }
            chartType="sparkline-latency"
          />
        </div>

        {/* KPI 4: Active Projects */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 min-w-0">
          <MetricCard
            title="Active Projects"
            badgeText="+2 this month"
            badgeType="neutral"
            value="12"
            subtitle={
              <span className="text-[#3F765C] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3F765C]" />
                12/12 passing health probes
              </span>
            }
            chartType="bars"
          />
        </div>
      </div>

      {/* 3. Primary Analytics Row: 12-Column Grid (8 cols Chart + 4 cols Errors) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-8 min-w-0">
          <RequestVolumeChart
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 min-w-0">
          <ErrorsByEndpoint onInspectTrace={handleInspectTraceFromErrors} />
        </div>
      </div>

      {/* 4. Secondary Analytics Row: 12-Column Grid (8 cols Table + 4 cols Latency & Health) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-8 min-w-0">
          <RecentRequestsTable
            requests={requests}
            selectedRequestId={selectedRequest?.id}
            onSelectRequest={onSelectRequest}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 min-w-0 flex flex-col justify-between gap-6">
          <LatencyDistribution />
          <GatewayHealth />
        </div>
      </div>

      {/* 5. Request Details Slide-Over Overlay Drawer */}
      <RequestDetailDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        request={selectedRequest}
        onViewLogs={onViewLogs}
      />
    </PageContainer>
  );
};
