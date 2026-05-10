import { API } from "@/api/itechApi";
import { Machine } from "@/interfaces/machine.interface";
import { Sensor } from "@/interfaces/sensor.interface";
import { useEffect, useState } from "react";

export const useMachines = () => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Machine[]>("/machines");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las máquinas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return { data, loading, error, refetch: fetchMachines };
};

export const useMachine = (id: number) => {
  const [data, setData] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMachine = async () => {
      setLoading(true);
      try {
        const { data } = await API.get<Machine>(`/machines/${id}`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudo cargar la máquina");
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [id]);

  return { data, loading, error };
};

export const useMachineSensors = (machineId: number) => {
  const [data, setData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!machineId) return;
    const fetchSensors = async () => {
      setLoading(true);
      try {
        const { data } = await API.get<Sensor[]>(`/machines/${machineId}/sensors`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudieron cargar los sensores de la máquina");
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, [machineId]);

  return { data, loading, error };
};
