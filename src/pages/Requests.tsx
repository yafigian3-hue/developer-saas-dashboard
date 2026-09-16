import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, Download } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { RecentRequestsTable } from "../components/dashboard/RecentRequestsTable";
import { RequestDetailDrawer } from "../components/dashboard/RequestDetailDrawer";
import type { ApiRequest } from "../types/request";

export interface RequestsPageProps {
  requests: ApiRequest[];
  selectedRequest: ApiRequest | null;
  onSelectRequest: (req: ApiRequest) => void;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onViewLogs: (reqId: string) => void;
  initialFilter?: string;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({
  requests,
  selectedRequest,
  onSelectRequest,
  isDrawerOpen,
  onCloseDrawer,
  onViewLogs,
  initialFilter = "",
}) => {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] leading-8 font-semibold text-[#181C1A] tracking-tight">
              Requests
            </h1>
            <span className="font-label-sm bg-[#3F6B5B]/20 text-[#265344] border border-[#265344]/30 px-2 py-0.5 rounded font-medium">
              Live Stream
            </span>
          </div>
          <p className="text-[13px] text-[#68716B] mt-0.5">
            Real-time HTTP ingress trace log with millisecond latency breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const csv =
                "id,time,method,endpoint,status,latency,project\n" +
                requests
                  .map(
                    (r) =>
                      `${r.id},${r.time},${r.method},${r.endpoint},${r.status},${r.latency},${r.project}`
                  )
                  .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `requests-telemetry-${Date.now()}.csv`;
              a.click();
            }}
            className="flex items-center gap-1.5 bg-white hover:bg-[#F0F1EE] px-3 py-1.5 rounded-lg border border-[#D9DDD7] shadow-sm text-[#181C1A] text-[12px] font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#58605B]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full">
        <RecentRequestsTable
          requests={requests}
          selectedRequestId={selectedRequest?.id}
          onSelectRequest={onSelectRequest}
          filterPathInitial={initialFilter}
        />
      </div>

      {/* Detail Drawer */}
      <RequestDetailDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        request={selectedRequest}
        onViewLogs={onViewLogs}
      />
    </PageContainer>
  );
};
