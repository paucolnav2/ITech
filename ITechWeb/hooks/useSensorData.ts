import { API } from "@/api/itechApi";
import { SensorData } from "@/interfaces/sensorData.interface";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 5000;

export const useSensorData = (sensorId: number) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get<SensorData[]>(`/sensor-data/${sensorId}`);
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los datos del sensor");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!sensorId) return;
    fetchData();
    const timer = setInterval(() => fetchData(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [sensorId]);

  return { data, loading, error, refetch: fetchData };
};
