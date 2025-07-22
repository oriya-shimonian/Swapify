import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { userRoutes } from "@/settings";

export interface LocationStat {
  location: string | null;
  count: number;
}

export const useUserLocationStats = () => {
  const [data, setData] = useState<LocationStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocationStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(userRoutes.getLocationStats, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(res.data.locationDistribution);
    } catch (err) {
      console.error("Failed to fetch location stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocationStats();
  }, [fetchLocationStats]);

  return {
    data,
    loading,
    refetch: fetchLocationStats,
  };
};
