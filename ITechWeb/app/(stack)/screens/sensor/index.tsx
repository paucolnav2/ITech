import SensorTypeBadge from "@/components/SensorTypeBadge";
import { Colors, SensorTypeColors } from "@/constants/theme";
import { useSensorData } from "@/hooks/useSensorData";
import { useSensors } from "@/hooks/useSensors";
import { SensorData } from "@/interfaces/sensorData.interface";
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
  const normalCount = readings.length - anomalyCount;
  const lastReading = readings[0];
  const typeColor = sensor
    ? (SensorTypeColors[sensor.sensorTypes?.[0] ?? ''] ?? Colors.accent)
    : Colors.accent;

  const maxValue = readings.length
    ? Math.max(...readings.map((r) => r.sensorValue))
    : 0;
  const minValue = readings.length
    ? Math.min(...readings.map((r) => r.sensorValue))
    : 0;
  const avgValue = readings.length
    ? readings.reduce((a, r) => a + r.sensorValue, 0) / readings.length
    : 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={Colors.primary} />
      }
    >
      <View style={styles.pageLayout}>
        <View style={styles.leftPanel}>
          <View style={styles.sensorCard}>
            <View style={[styles.iconWrap, { backgroundColor: typeColor + "20" }]}>
              <Ionicons name="pulse" size={32} color={typeColor} />
            </View>
            <Text style={styles.sensorName}>
              {sensor?.sensorName ?? `Sensor #${sensorId}`}
            </Text>
            <Text style={styles.sensorSubtitle}>ID: {sensorId} · Máquina #{sensor?.machineID ?? "—"}</Text>

            {sensor && (
              <View style={styles.badgesRow}>
                {sensor.sensorTypes.map((type) => (
                  <SensorTypeBadge key={type} type={type} />
                ))}
              </View>
            )}

            {lastReading && (
              <View style={[styles.lastReadingBox, { borderColor: typeColor + "40" }]}>
                <Text style={styles.lastReadingLabel}>ÚLTIMA LECTURA</Text>
                <Text style={[styles.lastReadingValue, { color: lastReading.isAnomaly ? Colors.danger : typeColor }]}>
                  {lastReading.sensorValue.toFixed(2)}
                  <Text style={styles.unit}> {lastReading.dataUnit}</Text>
                </Text>
                {lastReading.isAnomaly && (
                  <View style={styles.anomalyBadge}>
                    <Ionicons name="warning" size={12} color={Colors.danger} />
                    <Text style={styles.anomalyText}>ANOMALÍA</Text>
                  </View>
                )}
                <Text style={styles.timestamp}>
                  {new Date(lastReading.dateAndTime).toLocaleString("es-ES")}
                </Text>
              </View>
            )}

            {readings.length > 0 && (
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{readings.length}</Text>
                  <Text style={styles.statLabel}>Lecturas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.danger }]}>{anomalyCount}</Text>
                  <Text style={styles.statLabel}>Anomalías</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.success }]}>{normalCount}</Text>
                  <Text style={styles.statLabel}>Normales</Text>
                </View>
              </View>
            )}

            {readings.length > 1 && (
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.danger, fontSize: 16 }]}>{maxValue.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Máx</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: typeColor, fontSize: 16 }]}>{avgValue.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Media</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.success, fontSize: 16 }]}>{minValue.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Mín</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>
            Historial de lecturas ({readings.length})
          </Text>

          {loading && readings.length === 0 ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : error ? (
            <View style={styles.errorBox}>
              <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : readings.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="bar-chart-outline" size={40} color={Colors.muted} />
              <Text style={styles.emptyText}>Sin lecturas históricas disponibles</Text>
            </View>
          ) : (
            <FlatList
              data={readings}
              keyExtractor={(item, idx) => `${item.dateAndTime}-${idx}`}
              scrollEnabled={false}
              contentContainerStyle={styles.list}
              renderItem={({ item }: { item: SensorData }) => (
                <View
                  style={[
                    styles.readingCard,
                    item.isAnomaly && styles.readingCardAnomaly,
                  ]}
                >
                  <View style={styles.readingLeft}>
                    {item.isAnomaly && (
                      <Ionicons name="warning" size={16} color={Colors.danger} />
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
                  {item.isAnomaly && (
                    <View style={styles.anomalyTag}>
                      <Text style={styles.anomalyTagText}>ANOMALÍA</Text>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SensorDetail;

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
  sensorCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 14,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sensorName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  sensorSubtitle: {
    color: Colors.muted,
    fontSize: 13,
  },
  lastReadingBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  lastReadingLabel: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  lastReadingValue: {
    fontSize: 34,
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
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  statItem: {
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
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  list: {
    paddingBottom: 30,
  },
  readingCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  readingCardAnomaly: {
    borderColor: Colors.danger + "50",
    backgroundColor: Colors.danger + "08",
  },
  readingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  readingValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  readingUnit: {
    color: Colors.muted,
    fontSize: 13,
  },
  readingTime: {
    color: Colors.muted,
    fontSize: 12,
  },
  anomalyTag: {
    backgroundColor: Colors.danger + "20",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  anomalyTagText: {
    color: Colors.danger,
    fontSize: 10,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 40,
  },
  errorBox: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
    paddingHorizontal: 20,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "600",
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
