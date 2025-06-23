import { useEffect, useState } from "react";
import axios from "axios";
import { StatisticsData } from "@/types/statistics"; // ניצור טיפוס בהמשך
import toast from "react-hot-toast";
import { statisticRoutes } from "@/settings";

export const useStatistics = (filters: Record<string, string | null>) => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const res = await axios.get(statisticRoutes.getStatistics, {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setData(res.data);
      } catch (err) {
        console.error("Error loading statistics:", err);
        setError("שגיאה בטעינת סטטיסטיקות");
        toast.error("שגיאה בטעינת סטטיסטיקות");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [JSON.stringify(filters)]); // שינוי בפילטרים → ריענון

  return { data, loading, error };
};
