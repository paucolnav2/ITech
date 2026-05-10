import SensorTypeBadge from "@/components/SensorTypeBadge";
import StatusBadge from "@/components/StatusBadge";
import { Colors } from "@/constants/theme";
import { useMachine, useMachineSensors } from "@/hooks/useMachines";
import { useSensors } from "@/hooks/useSensors";
import { Sensor } from "@/interfaces/sensor.interface";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { setParams } from "expo-router/build/global-state/routing";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MaquinaDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const machineId = Number(id);

  const { data: machine, loading: loadingMachine, error: errorMachine } = useMachine(machineId);
  const { data: machineSensors, error: errorSensors } = useMachineSensors(machineId);
  const { data: allSensors, loading: loadingAll } = useSensors();

  const fallbackSensors = useMemo(
    () => allSensors.filter((s) => s.machineID === machineId),
    [allSensors, machineId],
  );

  const sensors = machineSensors.length > 0 ? machineSensors : fallbackSensors;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pageLayout}>
        <View style={styles.leftPanel}>
          <View style={styles.machineCard}>
            <View style={styles.iconWrap}>
              <Ionicons name="hardware-chip" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.machineName}>
              {machine?.name ?? `Máquina #${machineId}`}
            </Text>
            <Text style={styles.machineId}>ID del equipo: {machineId}</Text>

            {machine && (
              <View style={styles.statusSection}>
                <StatusBadge isGreen={machine.hasGreenState} size="large" />
                <View style={styles.detailItem}>
                  <Ionicons name="business" size={14} color={Colors.muted} />
                  <Text style={styles.detailText}>
                    Fábrica ID: {machine.factoryId}
                  </Text>
                </View>
              </View>
            )}

            {errorMachine && (
              <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={14} color={Colors.warning} />
                <Text style={styles.infoBannerText}>
                  Endpoint /machines/{machineId} no implementado. Mostrando sensores disponibles.
                </Text>
              </View>
            )}

            <View style={styles.statsBox}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{sensors.length}</Text>
                <Text style={styles.statLabel}>Sensores</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>
            Sensores de la Máquina ({sensors.length})
          </Text>

          {loadingAll && sensors.length === 0 ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : sensors.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="pulse-outline" size={40} color={Colors.muted} />
              <Text style={styles.emptyText}>No hay sensores para esta máquina</Text>
            </View>
          ) : (
            <View style={styles.sensorGrid}>
              {sensors.map((item: Sensor) => (
                <Pressable
                  key={item.sensorID}
                  style={({ pressed }) => [styles.sensorCard, pressed && { opacity: 0.8 }]}
                  onPress={() =>
                    router.push("../sensor", setParams({ id: item.sensorID }))
                  }
                >
                  <View style={styles.sensorCardTop}>
                    <Ionicons name="pulse" size={18} color={Colors.accent} />
                    <Text style={styles.sensorId}>#{item.sensorID}</Text>
                  </View>
                  <Text style={styles.sensorName} numberOfLines={2}>
                    {item.sensorName}
                  </Text>
                  <View style={styles.sensorCardFooter}>
                    <SensorTypeBadge type={item.sensorType} />
                    <Ionicons name="chevron-forward" size={14} color={Colors.muted} />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MaquinaDetail;

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
  machineCard: {
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
  machineName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  machineId: {
    color: Colors.muted,
    fontSize: 13,
  },
  statusSection: {
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
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
  statsBox: {
    flexDirection: "row",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sensorCard: {
    width: 220,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  sensorCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sensorId: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  sensorName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  sensorCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loader: {
    marginTop: 40,
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
