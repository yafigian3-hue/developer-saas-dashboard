import React from "react";
import { Download } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { RecentRequestsTable } from "../components/dashboard/RecentRequestsTable";
import { RequestDetailDrawer } from "../components/dashboard/RequestDetailDrawer";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import type { ApiRequest } from "../types/request";

export interface RequestsPageProps {
  requests: ApiRequest[];
  selectedRequest: ApiRequest | null;
  onSelectRequest: (req: ApiRequest) => void;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onViewLogs: (reqId: string) => void;
  onExportReport: () => void;
  onFilteredRequestsChange?: (requests: ApiRequest[]) => void;
  initialFilter?: string;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({
  requests,
  selectedRequest,
  onSelectRequest,
  isDrawerOpen,
  onCloseDrawer,
  onViewLogs,
  onExportReport,
  onFilteredRequestsChange,
  initialFilter = "",
}) => {
  return (
    <PageContainer>
      <header className="@container">
        <div className="flex min-w-0 flex-col gap-4 @md:flex-row @md:items-end @md:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold leading-8 tracking-tight text-text-primary">
                Requests
              </h1>

              <Badge variant="success" fontFamily="mono">
                Live Stream
              </Badge>
            </div>

            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-text-secondary">
              Real-time HTTP ingress trace log with millisecond latency
              breakdowns.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onExportReport}
            className="w-full shrink-0 @md:w-auto"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export Report</span>
          </Button>
        </div>
      </header>

      <div className="w-full min-w-0">
        <RecentRequestsTable
          requests={requests}
          selectedRequestId={selectedRequest?.id}
          onSelectRequest={onSelectRequest}
          filterPathInitial={initialFilter}
          onFilteredRequestsChange={onFilteredRequestsChange}
        />
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
