import { Colors, SensorTypeColors } from "@/constants/theme";
import { Anomaly } from "@/interfaces/anomaly.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AnomalyCardProps {
  anomaly: Anomaly;
}

const AnomalyCard = ({ anomaly }: AnomalyCardProps) => {
  const typeColor = SensorTypeColors[anomaly.sensorType] ?? Colors.danger;
  const date = new Date(anomaly.dateAndTime);
  const timeStr = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });

  return (
    <View style={[styles.card, { borderLeftColor: typeColor }]}>
      <View style={styles.row}>
        <Ionicons name="warning" size={18} color={Colors.danger} />
        <View style={styles.info}>
          <Text style={styles.sensorName}>{anomaly.sensorName}</Text>
          <Text style={styles.machine}>
            {anomaly.machineName} — {anomaly.factoryName}
          </Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: typeColor }]}>
            {anomaly.sensorValue.toFixed(2)}
          </Text>
          <Text style={styles.unit}>{anomaly.dataUnit}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.type}>{anomaly.sensorType}</Text>
        <Text style={styles.timestamp}>
          {dateStr} {timeStr}
        </Text>
      </View>
    </View>
  );
};

export default AnomalyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  info: {
    flex: 1,
  },
  sensorName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  machine: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  valueContainer: {
    alignItems: "flex-end",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
  unit: {
    color: Colors.muted,
    fontSize: 10,
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  type: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  timestamp: {
    color: Colors.muted,
    fontSize: 11,
  },
});
