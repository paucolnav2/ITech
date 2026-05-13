import { API } from "@/api/itechApi";
import { Anomaly } from "@/interfaces/anomaly.interface";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 5000;

export const useAnomalies = () => {
  const [data, setData] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get<Anomaly[]>("/anomalies");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las anomalías");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
    const timer = setInterval(() => fetchAnomalies(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return { data, loading, error, refetch: fetchAnomalies };
};
