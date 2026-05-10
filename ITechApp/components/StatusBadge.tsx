import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  isGreen: boolean;
  size?: "small" | "large";
}

const StatusBadge = ({ isGreen, size = "small" }: StatusBadgeProps) => {
  return (
    <View
      style={[
        styles.badge,
        isGreen ? styles.green : styles.red,
        size === "large" && styles.badgeLarge,
      ]}
    >
      <Text style={[styles.text, size === "large" && styles.textLarge]}>
        {isGreen ? "OK" : "ALERTA"}
      </Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  green: {
    backgroundColor: Colors.success,
  },
  red: {
    backgroundColor: Colors.danger,
  },
  text: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  textLarge: {
    fontSize: 14,
  },
});
