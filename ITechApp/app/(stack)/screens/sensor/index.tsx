import SensorTypeBadge from "@/components/SensorTypeBadge";
import { Colors, SensorTypeColors } from "@/constants/theme";
import { useSensorData } from "@/hooks/useSensorData";
import { useSensors } from "@/hooks/useSensors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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

const SensorDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sensorId = Number(id);

  const { data: allSensors } = useSensors();
  const sensor = useMemo(
    () => allSensors.find((s) => s.sensorID === sensorId),
    [allSensors, sensorId],
  );

  const { data: readings, loading, error, refetch } = useSensorData(sensorId);

  const anomalyCount = readings.filter((r) => r.isAnomaly).length;
  const lastReading = readings[0];
  const typeColor = sensor ? (SensorTypeColors[sensor.sensorType] ?? Colors.accent) : Colors.accent;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refetch}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <View style={[styles.iconWrap, { backgroundColor: typeColor + "20" }]}>
            <Ionicons name="pulse" size={26} color={typeColor} />
          </View>
          <View style={styles.sensorInfo}>
            <Text style={styles.sensorName}>
              {sensor?.sensorName ?? `Sensor #${sensorId}`}
            </Text>
            <Text style={styles.machineId}>Máquina #{sensor?.machineID ?? "—"}</Text>
          </View>
        </View>

        {sensor && (
          <View style={styles.badgeRow}>
            <SensorTypeBadge type={sensor.sensorType} />
          </View>
        )}

        {lastReading && (
          <View style={styles.lastReadingCard}>
            <Text style={styles.lastReadingLabel}>Última lectura</Text>
            <Text style={[styles.lastReadingValue, { color: lastReading.isAnomaly ? Colors.danger : typeColor }]}>
              {lastReading.sensorValue.toFixed(2)}
              <Text style={styles.unit}> {lastReading.dataUnit}</Text>
            </Text>
            {lastReading.isAnomaly && (
              <View style={styles.anomalyBadge}>
                <Ionicons name="warning" size={12} color={Colors.danger} />
                <Text style={styles.anomalyText}>ANOMALÍA DETECTADA</Text>
              </View>
            )}
            <Text style={styles.timestamp}>
              {new Date(lastReading.dateAndTime).toLocaleString("es-ES")}
            </Text>
          </View>
        )}

        {readings.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{readings.length}</Text>
              <Text style={styles.statLabel}>Lecturas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: anomalyCount > 0 ? Colors.danger : Colors.success }]}>
                {anomalyCount}
              </Text>
              <Text style={styles.statLabel}>Anomalías</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Historial de lecturas</Text>

      {loading && readings.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={32} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>
            El endpoint /sensor-data/{sensorId} aún no está implementado en el servidor Java
          </Text>
        </View>
      ) : readings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="bar-chart-outline" size={32} color={Colors.muted} />
          <Text style={styles.emptyText}>Sin lecturas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item, idx) => `${item.dateAndTime}-${idx}`}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.readingCard,
                item.isAnomaly && styles.readingCardAnomaly,
              ]}
            >
              <View style={styles.readingRow}>
                {item.isAnomaly && (
                  <Ionicons name="warning" size={14} color={Colors.danger} />
                )}
                <Text
                  style={[
                    styles.readingValue,
                    { color: item.isAnomaly ? Colors.danger : typeColor },
                  ]}
                >
                  {item.sensorValue.toFixed(2)}
                </Text>
                <Text style={styles.readingUnit}>{item.dataUnit}</Text>
              </View>
              <Text style={styles.readingTime}>
                {new Date(item.dateAndTime).toLocaleString("es-ES")}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

export default SensorDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  sensorCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  machineId: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  badgeRow: {
    marginBottom: 14,
  },
  lastReadingCard: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    gap: 4,
  },
  lastReadingLabel: {
    color: Colors.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lastReadingValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 16,
    fontWeight: "normal",
    color: Colors.muted,
  },
  anomalyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.danger + "20",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  anomalyText: {
    color: Colors.danger,
    fontSize: 10,
    fontWeight: "bold",
  },
  timestamp: {
    color: Colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.cardBorder,
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
  loader: {
    marginTop: 30,
  },
  errorBox: {
    alignItems: "center",
    paddingTop: 30,
    gap: 8,
    paddingHorizontal: 20,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  errorHint: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
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
  readingCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readingCardAnomaly: {
    borderColor: Colors.danger + "60",
    backgroundColor: Colors.danger + "10",
  },
  readingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readingValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  readingUnit: {
    color: Colors.muted,
    fontSize: 12,
  },
  readingTime: {
    color: Colors.muted,
    fontSize: 11,
  },
});
