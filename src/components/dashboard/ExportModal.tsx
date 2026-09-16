import React, { useState } from "react";
import { Download, FileText, Check } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<"json" | "csv" | "pdf">("csv");
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Operational Report"
      description="Download consolidated latency percentiles, error events, and traffic volume."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-[13px]">
        <div>
          <label className="block font-medium text-[#181C1A] mb-1.5">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["csv", "json", "pdf"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`p-3 rounded-lg border text-center font-mono uppercase text-[12px] transition-colors ${
                  format === fmt
                    ? "border-[#265344] bg-[#E4ECE8] text-[#265344] font-semibold"
                    : "border-[#D9DDD7] bg-white text-[#68716B] hover:bg-[#F0F1EE]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#F1F4F1] rounded border border-[#D9DDD7] text-[12px] text-[#58605B]">
          <div className="font-semibold text-[#181C1A] mb-1">Included telemetry:</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>1,842,291 requests total (30-day window)</li>
            <li>p50, p95, and p99 latency distributions</li>
            <li>Top failure endpoints and upstream timeout traces</li>
            <li>Gateway proxy edge health checks</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
