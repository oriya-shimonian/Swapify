import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { AuditLogFilters } from "@/types/auditLog";

export default function AuditLogsPage() {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<AuditLogFilters>({
    user: "",
    action: "",
    from: "",
    to: "",
  });

  const { logs, totalPages, loading } = useAuditLogs(page, filters);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex flex-col p-6 mt-[4.5rem]">
      <div>
        <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by user"
            value={filters.user || ""}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={filters.action || ""}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">כל הפעולות</option>
            <option value="הוספת">הוספה</option>
            <option value="עדכון">עדכון</option>
            <option value="מחיקת">מחיקה</option>
          </select>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-400 mt-6">
            ⚠️ אין לוגים להצגה
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Action
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logs.map((log) => {
                  const isExpanded = expandedRows[log.log_id];
                  const maxPreviewLength = 50;
                  const shouldTruncate = log.details.length > maxPreviewLength;
                  const previewText = shouldTruncate
                    ? log.details.slice(0, maxPreviewLength) + "..."
                    : log.details;

                  return (
                    <tr
                      key={log.log_id}
                      className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2 text-sm">{log.action}</td>
                      <td className="px-4 py-2 text-sm">
                        {log.user_name || "Unknown user"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm flex justify-between items-center gap-2">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* פאגינציה – צמוד לתחתית תמיד */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
