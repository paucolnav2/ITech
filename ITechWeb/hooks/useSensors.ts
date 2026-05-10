import { API } from "@/api/itechApi";
import { Sensor } from "@/interfaces/sensor.interface";
import { useEffect, useState } from "react";

export const useSensors = () => {
  const [data, setData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Sensor[]>("/sensors");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los sensores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return { data, loading, error, refetch: fetchSensors };
};
