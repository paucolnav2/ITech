import MachineCard from "@/components/MachineCard";
import { Colors } from "@/constants/theme";
import { useFactory, useFactoryMachines } from "@/hooks/useFactories";
import { useSensors } from "@/hooks/useSensors";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { setParams } from "expo-router/build/global-state/routing";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FabricaDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const factoryId = Number(id);

  const { data: factory, error: errorFactory } = useFactory(factoryId);
  const { data: machines, loading: loadingMachines, error: errorMachines } = useFactoryMachines(factoryId);
  const { data: sensors } = useSensors();

  const sensorCountByMachine = useMemo(() => {
    const map: Record<number, number> = {};
    sensors.forEach((s) => {
      map[s.machineID] = (map[s.machineID] ?? 0) + 1;
    });
    return map;
  }, [sensors]);

  const okCount = machines.filter((m) => m.hasGreenState).length;
  const alertCount = machines.length - okCount;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageLayout}>
        <View style={styles.leftPanel}>
          <View style={styles.factoryCard}>
            <View style={styles.iconWrap}>
              <Ionicons name="business" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.factoryName}>
              {factory?.name ?? `Fábrica #${factoryId}`}
            </Text>
            <Text style={styles.factoryId}>Instalación ID: {factoryId}</Text>

            {errorFactory && (
              <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={14} color={Colors.warning} />
                <Text style={styles.infoBannerText}>
                  Endpoint /factories/{factoryId} no implementado aún en el servidor.
                </Text>
              </View>
            )}

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { borderColor: Colors.primary }]}>
                <Text style={styles.statValue}>{machines.length}</Text>
                <Text style={styles.statLabel}>Máquinas</Text>
              </View>
              <View style={[styles.statBox, { borderColor: Colors.success }]}>
                <Text style={[styles.statValue, { color: Colors.success }]}>{okCount}</Text>
                <Text style={styles.statLabel}>OK</Text>
              </View>
              <View style={[styles.statBox, { borderColor: alertCount > 0 ? Colors.danger : Colors.muted }]}>
                <Text style={[styles.statValue, { color: alertCount > 0 ? Colors.danger : Colors.muted }]}>
                  {alertCount}
                </Text>
                <Text style={styles.statLabel}>Alerta</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>
            Máquinas de la Instalación ({machines.length})
          </Text>

          {loadingMachines && machines.length === 0 ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : errorMachines ? (
            <View style={styles.errorBox}>
              <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
              <Text style={styles.errorText}>{errorMachines}</Text>
            </View>
          ) : (
            <View style={styles.machineGrid}>
              {machines.map((machine: Machine) => (
                <View key={machine.id} style={styles.machineGridItem}>
                  <MachineCard
                    machine={machine}
                    sensorCount={sensorCountByMachine[machine.id]}
                    onPress={() =>
                      router.push("../maquina", setParams({ id: machine.id }))
                    }
                  />
                </View>
              ))}
              {machines.length === 0 && (
                <View style={styles.emptyBox}>
                  <Ionicons name="hardware-chip-outline" size={40} color={Colors.muted} />
                  <Text style={styles.emptyText}>Sin máquinas en esta fábrica</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default FabricaDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  pageLayout: {
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
    paddingBottom: 30,
  },
  leftPanel: {
    width: 300,
    minWidth: 260,
  },
  rightPanel: {
    flex: 1,
    minWidth: 300,
  },
  factoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  factoryName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  factoryId: {
    color: Colors.muted,
    fontSize: 13,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.warning + "15",
    borderRadius: 8,
    padding: 10,
  },
  infoBannerText: {
    color: Colors.warning,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    gap: 2,
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
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  machineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
  machineGridItem: {
    flex: 1,
    minWidth: 280,
  },
  loader: {
    marginTop: 40,
  },
  errorBox: {
    alignItems: "center",
    paddingTop: 40,
    gap: 10,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingTop: 40,
    gap: 10,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 15,
  },
});
