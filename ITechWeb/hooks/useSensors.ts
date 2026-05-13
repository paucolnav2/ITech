import { API } from "@/api/itechApi";
import { Sensor } from "@/interfaces/sensor.interface";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 5000;

export const useSensors = () => {
  const [data, setData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get<Sensor[]>("/sensors");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los sensores");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    const timer = setInterval(() => fetchSensors(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return { data, loading, error, refetch: fetchSensors };
};
