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
    label: "Print / Save as PDF",
    description: "Open a printable report",
    icon: FileText,
  },
];

const REPORT_THEME = {
  textPrimary: "#161A18",
  textSecondary: "#68716B",
  surface: "#FFFFFF",
  surfaceMuted: "#F0F1EE",
  border: "#D9DDD7",
} as const;

const toCsvField = (value: string | number): string =>
  `"${String(value).replace(/"/g, '""')}"`;

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
  const headers = EXPORT_COLUMNS.map((column) => {
    switch (column.key) {
      case "time":
        return "Time";
      case "method":
        return "Method";
      case "endpoint":
        return "Endpoint";
      case "status":
        return "Status";
      case "latency":
        return "Latency (ms)";
      case "project":
        return "Project";
    }
  });

  const rows = requests.map(getExportRow);

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
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
              <tr>
                ${headerHtml}
              </tr>
            </thead>

            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </main>
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
    if (printWindow.closed) return;

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
      title="Request report"
      description="Choose how you'd like to export your request data."
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            disabled={!hasRequests || completed}
            className="w-full sm:w-auto"
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
      <div className="space-y-4">
        <section aria-labelledby="export-format">
          <div className="mb-2">
            <h3
              id="export-format"
              className="font-label-sm font-semibold uppercase tracking-[0.08em] text-text-secondary"
            >
              Export format
            </h3>
          </div>

          <div
            className="grid gap-2 @sm:grid-cols-3"
            role="radiogroup"
            aria-label="Choose export format"
          >
            {formatOptions.map((option) => {
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
                    "flex min-w-0 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left outline-none transition-colors duration-150",
                    "focus-visible:ring-1 focus-visible:ring-accent",
                    isSelected
                      ? "border-accent bg-accent-soft"
                      : "border-border-default bg-surface hover:border-accent/40 hover:bg-surface-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                      isSelected
                        ? "border-accent/20 bg-surface text-accent"
                        : "border-border-default bg-surface-muted text-text-secondary",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-label-md font-semibold",
                        isSelected ? "text-accent" : "text-text-primary",
                      )}
                    >
                      {option.label}
                    </span>

                    <span className="mt-0.5 block truncate text-[10px] leading-4 text-text-secondary">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-accent bg-accent text-white"
                        : "border-border-default bg-surface",
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="h-2.5 w-2.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Export summary"
          className="border-y border-border-default py-3"
        >
          <dl className="grid grid-cols-3 gap-3">
            <div className="min-w-0">
              <dt className="font-label-sm text-text-secondary">Records</dt>
              <dd className="mt-0.5 truncate font-code-inline font-semibold text-text-primary">
                {requests.length.toLocaleString()}
              </dd>
            </div>

            <div className="min-w-0 border-l border-border-default pl-3">
              <dt className="font-label-sm text-text-secondary">Includes</dt>
              <dd className="mt-0.5 truncate font-code-inline font-semibold text-text-primary">
                {EXPORT_COLUMNS.length} fields
              </dd>
            </div>

            <div className="min-w-0 border-l border-border-default pl-3">
              <dt className="font-label-sm text-text-secondary">Scope</dt>
              <dd className="mt-0.5 truncate text-[11px] font-medium text-text-primary">
                Current view
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="included-fields">
          <div className="mb-2 flex items-center gap-2">
            <h3
              id="included-fields"
              className="font-label-sm font-semibold uppercase tracking-[0.08em] text-text-secondary"
            >
              Included fields
            </h3>

            <span className="rounded bg-accent-soft px-1.5 py-0.5 font-label-sm text-accent">
              {EXPORT_COLUMNS.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EXPORT_COLUMNS.map((column) => (
              <span
                key={column.key}
                className="rounded border border-border-default bg-surface-muted px-2 py-1 font-code-inline text-[10px] text-text-secondary"
              >
                {column.label}
              </span>
            ))}
          </div>
        </section>

        {!hasRequests && (
          <div className="border-l-2 border-warning bg-warning/[0.04] px-3 py-2.5">
            <p className="text-[11px] leading-4 text-warning">
              No request records are available in the current view.
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="border-l-2 border-danger bg-danger/[0.04] px-3 py-2.5"
          >
            <p className="text-[11px] leading-4 text-danger">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
