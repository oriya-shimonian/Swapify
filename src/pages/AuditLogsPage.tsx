import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { AuditLogFilters } from "@/types/auditLog";
import GenericTable, { Column } from "@/components/table/GenericTable";
import { Filters } from "@/components/UserDashboard/exchangeTabsHelpers/Filters";
import { DateRangePicker } from "@/components/DateRangePicker";

export default function AuditLogsPage() {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<AuditLogFilters>({
    user: "",
    action: "",
  });

  const { logs, totalPages, loading } = useAuditLogs(page, filters);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const toggleRow = (id: number) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  // const fields: FilterField[] = [
  //   { key: "user", type: "input", placeholder: "סינון לפי משתמש" },
  //   {
  //     key: "action",
  //     type: "select",
  //     placeholder: "סינון לפי פעולה",
  //     options: [
  //       { label: "הוספה", value: "הוספת" },
  //       { label: "עדכון", value: "עדכון" },
  //       { label: "מחיקה", value: "מחיקת" },
  //     ],
  //   },
  // ];

  const columns: Column<any>[] = [
    {
      label: "פעולה",
      width: "col-span-2",
      renderCell: (log) => log.action,
    },
    {
      label: "משתמש",
      width: "col-span-2",
      renderCell: (log) => log.user_name || "לא ידוע",
    },
    {
      label: "תאריך",
      width: "col-span-2",
      renderCell: (log) => new Date(log.timestamp).toLocaleString(),
    },
    {
      label: "פרטים",
      width: "col-span-4",
      renderCell: (log) => {
        const isExpanded = expandedRows[log.log_id];
        const maxPreviewLength = 50;
        const shouldTruncate = log.details.length > maxPreviewLength;
        const previewText = shouldTruncate
          ? log.details.slice(0, maxPreviewLength) + "..."
          : log.details;

        return (
          <div className="flex justify-between items-start gap-2">
            <span className="whitespace-pre-wrap break-words">
              {isExpanded ? log.details : previewText}
            </span>
            {shouldTruncate && (
              <button
                onClick={() => toggleRow(log.log_id)}
                className="text-blue-500 hover:underline text-xs"
              >
                {isExpanded ? "הצג פחות ↑" : "הצג הכל ↓"}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-5xl mx-auto mt-[4.5rem]">
      <h1 className="text-2xl font-bold mb-4">לוגים</h1>

      <div className="bg-white rounded-xl dark:bg-white/5 dark:backdrop-blur-mdshadow-sm border border-gray-100 dark:border-none p-6 pb-0 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="self-baseline">
            <DateRangePicker
              fromDate={filters.from ?? ""}
              toDate={filters.to ?? ""}
              onChange={(from, to) =>
                setFilters((prev) => ({ ...prev, from, to }))
              }
            />
          </div>
          <div className="flex-1 w-fit">
            <Filters
              filters={filters}
              setFilters={setFilters}
              resetPage={() => setPage(1)}
              fields={[
                { key: "user", type: "input", placeholder: "סינון לפי משתמש" },
                {
                  key: "action",
                  type: "select",
                  placeholder: "סינון לפי פעולה",
                  options: [
                    { label: "הוספה", value: "הוספת" },
                    { label: "עדכון", value: "עדכון" },
                    { label: "מחיקה", value: "מחיקת" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">טוען נתונים...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-gray-400 mt-6">⚠️ אין לוגים להצגה</div>
      ) : (
        <GenericTable
          items={logs}
          columns={columns}
          rowKey={(log) => log.log_id}
          gridCols="grid-cols-10"
        />
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          הקודם
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          עמוד {page} מתוך {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          הבא
        </button>
      </div>
    </div>
  );
}
