import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuditLog, AuditLogFilters } from '@/types/auditLog';
import { auditLogRoutes } from '@/settings';

type UseAuditLogsReturn = {
  logs: AuditLog[];
  totalPages: number;
  loading: boolean;
};

export const useAuditLogs = (
  page: number,
  filters: AuditLogFilters
): UseAuditLogsReturn => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: '10',
          ...(filters.user ? { user: filters.user } : {}),
          ...(filters.action ? { action: filters.action } : {}),
          ...(filters.from ? { from: filters.from } : {}),
          ...(filters.to ? { to: filters.to } : {}),
        });

        const res = await axios.get(`${auditLogRoutes.getAuditLogs}?${query.toString()}`);
        setLogs(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching audit logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, filters]);

  return { logs, totalPages, loading };
};
