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
  const { data: machineSensors, loading: loadingSensors, error: errorSensors } = useMachineSensors(machineId);

  const { data: allSensors, loading: loadingAll } = useSensors();
  const fallbackSensors = useMemo(
    () => allSensors.filter((s) => s.machineID === machineId),
    [allSensors, machineId],
  );

  const sensors = machineSensors.length > 0 ? machineSensors : fallbackSensors;
  const loading = loadingMachine || loadingSensors;

  if (loading && !machine) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.machineCard}>
        <View style={styles.machineHeader}>
          <View style={styles.iconWrap}>
            <Ionicons name="hardware-chip" size={28} color={Colors.primary} />
          </View>
          <View style={styles.machineInfo}>
            <Text style={styles.machineName}>
              {machine?.name ?? `Máquina #${machineId}`}
            </Text>
            <Text style={styles.machineId}>ID: {machineId}</Text>
          </View>
          {machine && <StatusBadge isGreen={machine.hasGreenState} size="large" />}
        </View>

        {machine && (
          <View style={styles.detailRow}>
            <Ionicons name="business" size={14} color={Colors.muted} />
            <Text style={styles.detailText}>Fábrica ID: {machine.factoryId}</Text>
          </View>
        )}

        {errorMachine && (
          <View style={styles.errorBanner}>
            <Ionicons name="information-circle" size={14} color={Colors.warning} />
            <Text style={styles.errorBannerText}>
              Detalle de máquina no disponible en el servidor
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        Sensores ({sensors.length})
      </Text>

      {loadingAll && sensors.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : sensors.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="pulse-outline" size={32} color={Colors.muted} />
          <Text style={styles.emptyText}>No hay sensores para esta máquina</Text>
        </View>
      ) : (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.sensorID.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: Sensor }) => (
            <Pressable
              style={({ pressed }) => [styles.sensorCard, pressed && { opacity: 0.8 }]}
              onPress={() =>
                router.push("../sensor", setParams({ id: item.sensorID }))
              }
            >
              <View style={styles.sensorRow}>
                <View style={styles.sensorIconWrap}>
                  <Ionicons name="pulse" size={16} color={Colors.accent} />
                </View>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorName} numberOfLines={1}>
                    {item.sensorName}
                  </Text>
                  <SensorTypeBadge type={item.sensorType} />
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
              </View>
            </Pressable>
          )}
        />
      )}
    </ScrollView>
  );
};

export default MaquinaDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  machineCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  machineInfo: {
    flex: 1,
  },
  machineName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  machineId: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  detailText: {
    color: Colors.muted,
    fontSize: 13,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: Colors.warning + "15",
    borderRadius: 8,
    padding: 8,
  },
  errorBannerText: {
    color: Colors.warning,
    fontSize: 12,
    flex: 1,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 30,
  },
  sensorCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sensorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sensorIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  sensorInfo: {
    flex: 1,
    gap: 6,
  },
  sensorName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  loader: {
    marginTop: 30,
  },
  emptyBox: {
    alignItems: "center",
    paddingTop: 30,
    gap: 8,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
  },
});
