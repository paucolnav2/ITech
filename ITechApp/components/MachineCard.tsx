import { Colors } from "@/constants/theme";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import StatusBadge from "./StatusBadge";

interface MachineCardProps {
  machine: Machine;
  sensorCount?: number;
  onPress?: () => void;
}

const MachineCard = ({ machine, sensorCount, onPress }: MachineCardProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: machine.hasGreenState ? Colors.success : Colors.danger },
        pressed && { opacity: 0.85 },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="hardware-chip" size={20} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {machine.name}
          </Text>
          <Text style={styles.subtitle}>
            {sensorCount !== undefined ? `${sensorCount} sensores` : `ID: ${machine.id}`}
          </Text>
        </View>
        <StatusBadge isGreen={machine.hasGreenState} />
        <Ionicons name="chevron-forward" size={16} color={Colors.muted} style={styles.chevron} />
      </View>
    </Pressable>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    marginLeft: 4,
  },
});
