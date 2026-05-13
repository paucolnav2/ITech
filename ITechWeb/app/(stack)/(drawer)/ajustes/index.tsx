import { Colors } from "@/constants/theme";
import { API } from "@/api/itechApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Ajustes = () => {
  const [testing, setTesting] = useState(false);
  const [serverStatus, setServerStatus] = useState<"unknown" | "online" | "offline">("unknown");

  const testConnection = async () => {
    setTesting(true);
    setServerStatus("unknown");
    try {
      await API.get("/sensors");
      setServerStatus("online");
    } catch {
      setServerStatus("offline");
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = () => {
    if (serverStatus === "online") return Colors.success;
    if (serverStatus === "offline") return Colors.danger;
    return Colors.muted;
  };

  const getStatusIcon = () => {
    if (serverStatus === "online") return "checkmark-circle";
    if (serverStatus === "offline") return "close-circle";
    return "help-circle";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ajustes del Sistema</Text>

      <View style={styles.grid}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conexión al servidor Java</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="server" size={18} color={Colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>URL del servidor</Text>
                <Text style={styles.value}>
                  {process.env.EXPO_PUBLIC_API_URL ?? "No configurada"}
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Ionicons name={getStatusIcon()} size={18} color={getStatusColor()} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Estado de conexión</Text>
                <Text style={[styles.value, { color: getStatusColor() }]}>
                  {serverStatus === "online"
                    ? "Servidor en línea"
                    : serverStatus === "offline"
                    ? "Servidor fuera de línea"
                    : "Sin comprobar"}
                </Text>
              </View>
              {testing && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>

            <TouchableOpacity
              style={styles.testButton}
              onPress={testConnection}
              disabled={testing}
            >
              <Ionicons name="wifi" size={16} color="#fff" />
              <Text style={styles.testButtonText}>
                {testing ? "Comprobando..." : "Probar conexión con GET /sensors"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del sistema</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="layers" size={18} color={Colors.accent} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Aplicación</Text>
                <Text style={styles.value}>ITechWeb v1.0.0</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Ionicons name="code-slash" size={18} color={Colors.accent} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Framework</Text>
                <Text style={styles.value}>Expo React Native (web)</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Ionicons name="school" size={18} color={Colors.accent} />
              <View style={styles.infoContent}>
                <Text style={styles.label}>Proyecto</Text>
                <Text style={styles.value}>Agregador y Analizador de Datos IoT Industriales</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Ajustes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  header: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  grid: {
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    color: Colors.muted,
    fontSize: 12,
  },
  value: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  testButton: {
    margin: 16,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
