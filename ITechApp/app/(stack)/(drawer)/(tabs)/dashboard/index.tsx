import MachineCard from "@/components/MachineCard";
import { Colors } from "@/constants/theme";
import { useMachines } from "@/hooks/useMachines";
import { useSensors } from "@/hooks/useSensors";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Dashboard = () => {
  const { data: machines, loading: loadingMachines, error: errorMachines, refetch: refetchMachines } = useMachines();
  const { data: sensors, loading: loadingSensors, refetch: refetchSensors } = useSensors();

  const isRefreshing = loadingMachines || loadingSensors;

  const onRefresh = () => {
    refetchMachines();
    refetchSensors();
  };

  const sensorCountByMachine = useMemo(() => {
    const map: Record<number, number> = {};
    sensors.forEach((s) => {
      map[s.machineID] = (map[s.machineID] ?? 0) + 1;
    });
    return map;
  }, [sensors]);

  const stats = useMemo(() => {
    const total = machines.length;
    const ok = machines.filter((m) => m.hasGreenState).length;
    const alert = total - ok;
    return { total, ok, alert };
  }, [machines]);

  const renderMachine = ({ item }: { item: Machine }) => (
    <MachineCard
      machine={item}
      sensorCount={sensorCountByMachine[item.id]}
      onPress={() =>
        router.push({ pathname: "/screens/maquina", params: { id: item.id } })
      }
    />
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      <Text style={styles.header}>Panel de Control</Text>
      <Text style={styles.subheader}>Estado general de la planta</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: Colors.primary }]}>
          <Ionicons name="hardware-chip" size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Máquinas</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.success }]}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={[styles.statValue, { color: Colors.success }]}>{stats.ok}</Text>
          <Text style={styles.statLabel}>Operativas</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.danger }]}>
          <Ionicons name="warning" size={20} color={Colors.danger} />
          <Text style={[styles.statValue, { color: Colors.danger }]}>{stats.alert}</Text>
          <Text style={styles.statLabel}>En alerta</Text>
        </View>
      </View>

      <View style={styles.sensorsStatCard}>
        <Ionicons name="pulse" size={18} color={Colors.accent} />
        <Text style={styles.sensorsStatText}>
          {sensors.length} sensores monitorizados en tiempo real
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Máquinas</Text>

      {loadingMachines && machines.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : errorMachines ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={32} color={Colors.muted} />
          <Text style={styles.errorText}>{errorMachines}</Text>
          <Text style={styles.errorHint}>
            Asegúrate de que el servidor Java está activo en el endpoint /machines
          </Text>
        </View>
      ) : machines.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="hardware-chip-outline" size={32} color={Colors.muted} />
          <Text style={styles.emptyText}>No hay máquinas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMachine}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },
  subheader: {
    color: Colors.muted,
    fontSize: 13,
    marginBottom: 20,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 11,
  },
  sensorsStatCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sensorsStatText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "500",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  errorBox: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  errorHint: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
});
