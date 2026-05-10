import { Ionicons } from "@expo/vector-icons";
import { SensorTypeColors, SensorTypeIcons } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SensorTypeBadgeProps {
  type: string;
}

const SensorTypeBadge = ({ type }: SensorTypeBadgeProps) => {
  const color = SensorTypeColors[type] ?? SensorTypeColors.OTHERS;
  const icon = (SensorTypeIcons[type] ?? "help-circle") as any;

  return (
    <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color }]}>
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[styles.text, { color }]}>{type}</Text>
    </View>
  );
};

export default SensorTypeBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
