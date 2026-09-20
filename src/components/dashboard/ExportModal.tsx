import React, { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { ApiRequest } from "../../types/request";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests?: ApiRequest[];
}

type ExportFormat = "csv" | "json" | "pdf";

const formatOptions: ExportFormat[] = ["csv", "json", "pdf"];

const toCsvField = (value: string | number): string =>
  `"${String(value).replace(/"/g, '""')}"`;

const escapeHtml = (value: string | number): string =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );

const buildCsv = (requests: ApiRequest[]): string => {
  const headers = [
    "Time",
    "Method",
    "Endpoint",
    "Status",
    "Latency (ms)",
    "Project",
  ];

  const rows = requests.map((request) => [
    request.time,
    request.method,
    request.endpoint,
    request.status,
    request.latency,
    request.project,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(toCsvField).join(","))
    .join("\r\n");
};

const downloadBlob = (
  content: string,
  filename: string,
  mimeType: string,
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

const openPrintableReport = (requests: ApiRequest[]): boolean => {
  const rowsHtml = requests
    .map(
      (request) => `
        <tr>
          <td>${escapeHtml(request.time)}</td>
          <td>${escapeHtml(request.method)}</td>
          <td>${escapeHtml(request.endpoint)}</td>
          <td>${escapeHtml(request.status)}</td>
          <td>${escapeHtml(request.latency)}ms</td>
          <td>${escapeHtml(request.project)}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Operational Report</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 24px;
            color: #161A18;
            background: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          h1 {
            margin: 0 0 4px;
            font-size: 18px;
            line-height: 1.4;
          }

          p {
            margin: 0;
            color: #68716B;
            font-size: 12px;
          }

          table {
            width: 100%;
            margin-top: 16px;
            border-collapse: collapse;
            font-size: 11px;
          }

          th,
          td {
            padding: 6px 8px;
            border: 1px solid #D9DDD7;
            text-align: left;
          }

          th {
            background: #F0F1EE;
            text-transform: uppercase;
            letter-spacing: 0.02em;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <h1>Operational Report</h1>
        <p>${requests.length.toLocaleString()} requests included</p>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Project</th>
            </tr>
          </thead>

          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  window.setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 250);

  return true;
};

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  requests = [],
}) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormat("csv");
    setDownloaded(false);
  }, [isOpen]);

  const handleDownload = () => {
    const dateStamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      downloadBlob(
        buildCsv(requests),
        `requests-report-${dateStamp}.csv`,
        "text/csv;charset=utf-8;",
      );
    }

    if (format === "json") {
      downloadBlob(
        JSON.stringify(requests, null, 2),
        `requests-report-${dateStamp}.json`,
        "application/json;charset=utf-8;",
      );
    }

    if (format === "pdf") {
      const opened = openPrintableReport(requests);

      if (!opened) {
        return;
      }
    }

    setDownloaded(true);

    window.setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Operational Report"
      description="Download consolidated request telemetry for the current view."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" size="sm" onClick={handleDownload}>
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download Report</span>
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-[13px]">
        <div>
          <label className="mb-1.5 block font-medium text-text-primary">
            Export Format
          </label>

          <div className="grid grid-cols-3 gap-2">
            {formatOptions.map((option) => {
              const isSelected = format === option;

              return (
                <Button
                  key={option}
                  variant={isSelected ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFormat(option)}
                  className={
                    isSelected
                      ? "border-accent bg-accent-soft text-accent"
                      : "border border-border-default text-text-secondary hover:bg-surface-muted"
                  }
                >
                  {option.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="rounded border border-border-default bg-surface-muted p-3 text-[12px] text-text-secondary">
          <div className="mb-1 font-semibold text-text-primary">
            Included telemetry:
          </div>

          <ul className="list-inside list-disc space-y-0.5">
            <li>
              {requests.length.toLocaleString()} requests included (current
              view)
            </li>
            <li>p50, p95, and p99 latency distributions</li>
            <li>Top failure endpoints and upstream timeout traces</li>
            <li>Gateway proxy edge health checks</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
