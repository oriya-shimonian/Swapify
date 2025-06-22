// hooks/useStatistics.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface GeneralStats {
  total_users: number;
  active_users: number;
  total_products: number;
  available_products: number;
  total_requests: number;
  approved_requests: number;
  total_exchanges: number;
  total_chats: number;
}

export const useStatistics = (filters: {
  fromDate?: string;
  toDate?: string;
  category?: string;
  location?: string;
}) => {
  const [data, setData] = useState<GeneralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/statistics", { params: filters });
        setData(response.data.general);
      } catch (err) {
        setError("שגיאה בטעינת נתוני סטטיסטיקה");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  return { data, loading, error };
};
