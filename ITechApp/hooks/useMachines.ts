import { API } from "@/api/itechApi";
import { Machine } from "@/interfaces/machine.interface";
import { Sensor } from "@/interfaces/sensor.interface";
import { useEffect, useState } from "react";

const POLL_INTERVAL = 5000;

export const useMachines = () => {
  const [data, setData] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await API.get<Machine[]>("/machines");
      setData(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar las máquinas");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
    const timer = setInterval(() => fetchMachines(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return { data, loading, error, refetch: fetchMachines };
};

export const useMachine = (id: number) => {
  const [data, setData] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMachine = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const { data } = await API.get<Machine>(`/machines/${id}`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudo cargar la máquina");
      } finally {
        if (!silent) setLoading(false);
      }
    };
    fetchMachine();
    const timer = setInterval(() => fetchMachine(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [id]);

  return { data, loading, error };
};

export const useMachineSensors = (machineId: number) => {
  const [data, setData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!machineId) return;
    const fetchSensors = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const { data } = await API.get<Sensor[]>(`/machines/${machineId}/sensors`);
        setData(data);
        setError(null);
      } catch {
        setError("No se pudieron cargar los sensores de la máquina");
      } finally {
        if (!silent) setLoading(false);
      }
    };
    fetchSensors();
    const timer = setInterval(() => fetchSensors(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [machineId]);

  return { data, loading, error };
};
