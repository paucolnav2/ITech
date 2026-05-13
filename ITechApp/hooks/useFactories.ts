import { API } from "@/api/itechApi";
import { Factory } from "@/interfaces/factory.interface";
import { Machine } from "@/interfaces/machine.interface";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 5000;

export const useFactories = () => {
  const [data, setData] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFactories = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get<Factory[]>("/factories");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las fábricas");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactories();
    const timer = setInterval(() => fetchFactories(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return { data, loading, error, refetch: fetchFactories };
};

export const useFactory = (id: number) => {
  const [data, setData] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchFactory = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const { data } = await API.get<Factory>(`/factories/${id}`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudo cargar la fábrica");
      } finally {
        if (!silent) setLoading(false);
      }
    };
    fetchFactory();
    const timer = setInterval(() => fetchFactory(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [id]);

  return { data, loading, error };
};

export const useFactoryMachines = (factoryId: number) => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!factoryId) return;
    const fetchMachines = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const { data } = await API.get<Machine[]>(`/factories/${factoryId}/machines`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudieron cargar las máquinas de la fábrica");
      } finally {
        if (!silent) setLoading(false);
      }
    };
    fetchMachines();
    const timer = setInterval(() => fetchMachines(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [factoryId]);

  return { data, loading, error };
};
