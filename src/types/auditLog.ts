export type AuditLog = {
    log_id: number;
    action: string;
    user_name?: string;
    timestamp: string;
    details: string;
  };
  
  export type AuditLogFilters = {
    user?: string;
    action?: string;
    from?: string;
    to?: string;
  };
  