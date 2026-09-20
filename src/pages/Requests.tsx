import React, { useState } from "react";
import { Download } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { RecentRequestsTable } from "../components/dashboard/RecentRequestsTable";
import { RequestDetailDrawer } from "../components/dashboard/RequestDetailDrawer";
import { ExportModal } from "../components/dashboard/ExportModal";
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenExportModal = () => {
    setIsExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold leading-8 tracking-tight text-text-primary">
              Requests
            </h1>

            <Badge variant="success" fontFamily="mono">
              Live Stream
            </Badge>
          </div>

          <p className="mt-0.5 text-[13px] text-text-secondary">
            Real-time HTTP ingress trace log with millisecond latency
            breakdowns.
          </p>
        </div>

        {/* Export */}
        <div className="flex w-full shrink-0 items-center sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenExportModal}
            className="w-full sm:w-auto"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="w-full min-w-0">
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

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        requests={requests}
      />
    </PageContainer>
  );
};
