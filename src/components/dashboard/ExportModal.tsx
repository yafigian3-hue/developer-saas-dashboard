import React, { useEffect, useRef, useState } from "react";
import { Check, Download, FileJson, FileText, Table2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { ApiRequest } from "../../types/request";
import { cn } from "../../lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests?: ApiRequest[];
}

type ExportFormat = "csv" | "json" | "print";

const EXPORT_COLUMNS = [
  { key: "time", label: "Timestamp" },
  { key: "method", label: "Method" },
  { key: "endpoint", label: "Endpoint" },
  { key: "status", label: "Status" },
  { key: "latency", label: "Latency" },
  { key: "project", label: "Project" },
] as const;

const CSV_HEADERS = [
  "Time",
  "Method",
  "Endpoint",
  "Status",
  "Latency (ms)",
  "Project",
];

const formatOptions: Array<{
  id: ExportFormat;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "csv",
    label: "CSV",
    description: "Best for spreadsheets",
    icon: Table2,
  },
  {
    id: "json",
    label: "JSON",
    description: "Best for developers",
    icon: FileJson,
  },
  {
    id: "print",
    label: "Print / PDF",
    description: "Printable request report",
    icon: FileText,
  },
];

const REPORT_THEME = {
  textPrimary: "#172033",
  textSecondary: "#667085",
  accent: "#315EFB",
  surface: "#FFFFFF",
  surfaceMuted: "#F5F7FA",
  border: "#E5EAF1",
} as const;

const toCsvField = (value: string | number): string => {
  let normalized = String(value);

  // Prevent spreadsheet formula injection from untrusted string values.
  if (typeof value === "string" && /^[\t\r ]*[=+\-@]/.test(normalized)) {
    normalized = `'${normalized}`;
  }

  return `"${normalized.replace(/"/g, '""')}"`;
};

const escapeHtml = (value: string | number): string =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

const getExportRow = (request: ApiRequest): Array<string | number> => [
  request.time,
  request.method,
  request.endpoint,
  request.status,
  request.latency,
  request.project,
];

const buildCsv = (requests: ApiRequest[]): string => {
  const rows = requests.map(getExportRow);

  return [CSV_HEADERS, ...rows]
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
  link.rel = "noopener";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

const openPrintableReport = (requests: ApiRequest[]): boolean => {
  const headerHtml = EXPORT_COLUMNS.map((column) => {
    const labelMap: Record<(typeof EXPORT_COLUMNS)[number]["key"], string> = {
      time: "Time",
      method: "Method",
      endpoint: "Endpoint",
      status: "Status",
      latency: "Latency",
      project: "Project",
    };

    return `<th>${labelMap[column.key]}</th>`;
  }).join("");

  const rowsHtml =
    requests.length > 0
      ? requests
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
          .join("")
      : `
          <tr>
            <td colspan="${EXPORT_COLUMNS.length}" class="empty">
              No request records found.
            </td>
          </tr>
        `;

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Operational Request Report</title>

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }

          body {
            padding: 32px;
            color: ${REPORT_THEME.textPrimary};
            background: ${REPORT_THEME.surface};
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          main {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }

          header {
            padding-bottom: 16px;
            border-bottom: 1px solid ${REPORT_THEME.border};
          }

          h1 {
            margin: 0;
            font-size: 20px;
            line-height: 1.4;
            font-weight: 600;
            letter-spacing: -0.02em;
          }

          p {
            margin: 4px 0 0;
            color: ${REPORT_THEME.textSecondary};
            font-size: 12px;
            line-height: 1.5;
          }

          table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            font-size: 11px;
          }

          th,
          td {
            padding: 8px 10px;
            border-bottom: 1px solid ${REPORT_THEME.border};
            text-align: left;
            vertical-align: top;
          }

          th {
            color: ${REPORT_THEME.textSecondary};
            background: ${REPORT_THEME.surfaceMuted};
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          td {
            word-break: break-word;
          }

          tr:last-child td {
            border-bottom: 0;
          }

          .empty {
            padding: 24px;
            color: ${REPORT_THEME.textSecondary};
            text-align: center;
          }

          @media (max-width: 700px) {
            body {
              padding: 16px;
            }

            table {
              font-size: 10px;
            }

            th,
            td {
              padding: 7px;
            }
          }

          @media print {
            body {
              padding: 0;
            }

            main {
              max-width: none;
            }
          }
        </style>
      </head>

      <body>
        <main>
          <header>
            <h1>Operational Request Report</h1>
            <p>
              ${requests.length.toLocaleString()} request${
                requests.length === 1 ? "" : "s"
              } included in this report.
            </p>
          </header>

          <table>
            <thead>
              <tr>${headerHtml}</tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </main>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");

  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  window.setTimeout(() => {
    if (printWindow.closed) return;

    printWindow.focus();
    printWindow.print();
  }, 250);

  return true;
};

const labelClass =
  "font-label-sm font-semibold uppercase tracking-wide text-text-secondary";

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  requests = [],
}) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const closeTimeoutRef = useRef<number | null>(null);

  const hasRequests = requests.length > 0;
  const selectedOption = formatOptions.find((option) => option.id === format);

  useEffect(() => {
    if (!isOpen) return;

    setFormat("csv");
    setCompleted(false);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setCompleted(false);
    setError("");
    onClose();
  };

  const handleExport = () => {
    if (!hasRequests) return;

    setError("");

    const dateStamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      downloadBlob(
        buildCsv(requests),
        `requests-report-${dateStamp}.csv`,
        "text/csv;charset=utf-8;",
      );
    } else if (format === "json") {
      downloadBlob(
        JSON.stringify(requests, null, 2),
        `requests-report-${dateStamp}.json`,
        "application/json;charset=utf-8;",
      );
    } else {
      const opened = openPrintableReport(requests);

      if (!opened) {
        setError(
          "Unable to open the printable report. Check your browser pop-up settings and try again.",
        );
        return;
      }
    }

    setCompleted(true);

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setCompleted(false);
      closeTimeoutRef.current = null;
      onClose();
    }, 1200);
  };

 
  const completionLabel = format === "print" ? "Opened" : "Exported";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Export Requests"
      description="Choose a format to export your API request data."
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            disabled={!hasRequests || completed}
          >
            {completed ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{completionLabel}</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {format === "print"
                    ? "Print Report"
                    : `Export ${selectedOption?.label ?? "Report"}`}
                </span>
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Format */}
        <section aria-labelledby="export-format">
          <div className="mb-2.5">
            <h3
              id="export-format"
              className="text-[12px] font-medium text-text-primary"
            >
              Export Format
            </h3>
            <p className="mt-1 text-[11px] leading-4 text-text-secondary">
              Select the file format you want to use.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-md border border-border-default"
            role="radiogroup"
            aria-label="Choose export format"
          >
            {formatOptions.map((option, index) => {
              const isSelected = format === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setFormat(option.id);
                    setError("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors duration-150",
                    index > 0 && "border-t border-border-default",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
                    isSelected
                      ? "bg-accent-soft/60"
                      : "bg-surface hover:bg-surface-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-accent/20 bg-surface text-accent"
                        : "border-border-default bg-surface-muted text-text-secondary",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-medium text-text-primary">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-text-secondary">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-accent bg-accent"
                        : "border-border-default bg-surface",
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <Check className="h-2.5 w-2.5 text-white" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Export Summary */}
        <section
          aria-labelledby="export-summary"
          className="border-y border-border-default py-3.5"
        >
          <div className="mb-3">
            <h3
              id="export-summary"
              className="text-[12px] font-medium text-text-primary"
            >
              Export Summary
            </h3>
            <p className="mt-1 text-[11px] text-text-secondary">
              Data included in this export.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            <div className="min-w-0">
              <dt className="text-[11px] text-text-secondary">Records</dt>
              <dd className="mt-1 text-[13px] font-semibold text-text-primary">
                {requests.length.toLocaleString()}
              </dd>
            </div>

            <div className="min-w-0 border-l border-border-default pl-3">
              <dt className="text-[11px] text-text-secondary">Fields</dt>
              <dd className="mt-1 text-[13px] font-semibold text-text-primary">
                {EXPORT_COLUMNS.length}
              </dd>
            </div>

            <div className="min-w-0 border-l border-border-default pl-3">
              <dt className="text-[11px] text-text-secondary">Format</dt>
              <dd className="mt-1 truncate text-[12px] font-medium text-text-primary">
                {selectedOption?.label}
              </dd>
            </div>
          </dl>
        </section>

        {/* Included Fields */}
        <section aria-labelledby="included-fields">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <h3
              id="included-fields"
              className="text-[12px] font-medium text-text-primary"
            >
              Included Fields
            </h3>
            <span className="text-[11px] text-text-secondary">
              {EXPORT_COLUMNS.length} fields
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {EXPORT_COLUMNS.map((column) => (
              <div
                key={column.key}
                className="flex min-w-0 items-center gap-2"
              >
                <Check
                  className="h-3 w-3 shrink-0 text-success"
                  aria-hidden="true"
                />
                <span className="truncate text-[11px] text-text-secondary">
                  {column.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {!hasRequests && (
          <div
            role="status"
            className="rounded-md border border-warning/20 bg-warning/[0.04] px-3 py-2.5"
          >
            <p className="text-[11px] leading-4 text-warning">
              No request records are available in the current view.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-danger/20 bg-danger/[0.04] px-3 py-2.5"
          >
            <p className="text-[11px] leading-4 text-danger">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};



