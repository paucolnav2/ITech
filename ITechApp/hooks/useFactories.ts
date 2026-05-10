import { API } from "@/api/itechApi";
import { Factory } from "@/interfaces/factory.interface";
import { Machine } from "@/interfaces/machine.interface";
import { useEffect, useState } from "react";

export const useFactories = () => {
  const [data, setData] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFactories = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Factory[]>("/factories");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las fábricas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  return { data, loading, error, refetch: fetchFactories };
};

export const useFactory = (id: number) => {
  const [data, setData] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchFactory = async () => {
      setLoading(true);
      try {
        const { data } = await API.get<Factory>(`/factories/${id}`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudo cargar la fábrica");
      } finally {
        setLoading(false);
      }
    };
    fetchFactory();
  }, [id]);

  return { data, loading, error };
};

export const useFactoryMachines = (factoryId: number) => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!factoryId) return;
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const { data } = await API.get<Machine[]>(`/factories/${factoryId}/machines`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudieron cargar las máquinas de la fábrica");
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [factoryId]);

  return { data, loading, error };
};
