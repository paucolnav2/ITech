import MachineCard from "@/components/MachineCard";
import { Colors } from "@/constants/theme";
import { useMachines } from "@/hooks/useMachines";
import { useSensors } from "@/hooks/useSensors";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { setParams } from "expo-router/build/global-state/routing";
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
        router.push("../../../../screens/maquina", setParams({ id: item.id }))
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
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.header}>Panel de Control</Text>
          <Text style={styles.subheader}>Monitorización en tiempo real · ITechWeb</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>EN VIVO</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: Colors.primary }]}>
          <Ionicons name="hardware-chip" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Máquinas totales</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: Colors.success }]}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={[styles.statValue, { color: Colors.success }]}>{stats.ok}</Text>
          <Text style={styles.statLabel}>Operativas</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: Colors.danger }]}>
          <Ionicons name="warning" size={24} color={Colors.danger} />
          <Text style={[styles.statValue, { color: Colors.danger }]}>{stats.alert}</Text>
          <Text style={styles.statLabel}>En alerta</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: Colors.accent }]}>
          <Ionicons name="pulse" size={24} color={Colors.accent} />
          <Text style={[styles.statValue, { color: Colors.accent }]}>{sensors.length}</Text>
          <Text style={styles.statLabel}>Sensores activos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Estado de Máquinas</Text>

      {loadingMachines && machines.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} size="large" />
      ) : errorMachines ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
          <Text style={styles.errorText}>{errorMachines}</Text>
          <Text style={styles.errorHint}>
            El endpoint /machines aún no está implementado en el servidor Java.
            Implementar en HTTPHandler para mostrar el estado de las máquinas.
          </Text>
        </View>
      ) : machines.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="hardware-chip-outline" size={40} color={Colors.muted} />
          <Text style={styles.emptyText}>No hay máquinas registradas</Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {machines.map((machine) => (
            <View key={machine.id} style={styles.gridItem}>
              <MachineCard
                machine={machine}
                sensorCount={sensorCountByMachine[machine.id]}
                onPress={() =>
                  router.push("../../../../screens/maquina", setParams({ id: machine.id }))
                }
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  header: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  subheader: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.success + "20",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.success + "40",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  liveText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 28,
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderTopWidth: 3,
    gap: 6,
  },
  statValue: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 30,
  },
  gridItem: {
    flex: 1,
    minWidth: 280,
  },
  loader: {
    marginTop: 60,
  },
  errorBox: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 30,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  errorHint: {
    color: Colors.muted,
    fontSize: 13,
    textAlign: "center",
    maxWidth: 500,
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 15,
  },
});
