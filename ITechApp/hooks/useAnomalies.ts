import { API } from "@/api/itechApi";
import { Anomaly } from "@/interfaces/anomaly.interface";
import { useEffect, useState } from "react";

export const useAnomalies = () => {
  const [data, setData] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Anomaly[]>("/anomalies");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las anomalías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  return { data, loading, error, refetch: fetchAnomalies };
};
