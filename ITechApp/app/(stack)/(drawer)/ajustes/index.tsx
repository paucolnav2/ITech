import { Colors } from "@/constants/theme";
import { API } from "@/api/itechApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
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

  const getStatusText = () => {
    if (serverStatus === "online") return "Servidor en línea";
    if (serverStatus === "offline") return "Servidor fuera de línea";
    return "Estado desconocido";
  };

  const apiUrl =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_API_URL_ANDROID
      : process.env.EXPO_PUBLIC_API_URL_IOS;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ajustes</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servidor Java</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="server" size={18} color={Colors.primary} />
            <View style={styles.info}>
              <Text style={styles.label}>URL del servidor</Text>
              <Text style={styles.value}>{apiUrl ?? "No configurada"}</Text>
            </View>
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <Ionicons name="ellipse" size={14} color={getStatusColor()} />
            <View style={styles.info}>
              <Text style={styles.label}>Estado de conexión</Text>
              <Text style={[styles.value, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
            {testing && <ActivityIndicator size="small" color={Colors.primary} />}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={testConnection}
          disabled={testing}
        >
          <Ionicons name="wifi" size={18} color="#fff" />
          <Text style={styles.buttonText}>
            {testing ? "Comprobando..." : "Probar conexión"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endpoints del servidor</Text>
        <View style={styles.card}>
          {[
            { path: "GET /sensors", desc: "Lista todos los sensores", available: true },
            { path: "GET /machines", desc: "Lista todas las máquinas", available: false },
            { path: "GET /machines/{id}", desc: "Detalle de máquina", available: false },
            { path: "GET /factories", desc: "Lista todas las fábricas", available: false },
            { path: "GET /factories/{id}", desc: "Detalle de fábrica", available: false },
            { path: "GET /sensor-data/{id}", desc: "Datos históricos del sensor", available: false },
            { path: "GET /anomalies", desc: "Anomalías recientes", available: false },
          ].map((ep, idx, arr) => (
            <View
              key={ep.path}
              style={[styles.endpoint, idx < arr.length - 1 && styles.endpointBorder]}
            >
              <Ionicons
                name={ep.available ? "checkmark-circle" : "time"}
                size={16}
                color={ep.available ? Colors.success : Colors.muted}
              />
              <View style={styles.endpointInfo}>
                <Text style={styles.endpointPath}>{ep.path}</Text>
                <Text style={styles.endpointDesc}>{ep.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="information-circle" size={18} color={Colors.accent} />
            <View style={styles.info}>
              <Text style={styles.label}>Versión</Text>
              <Text style={styles.value}>ITechApp 1.0.0</Text>
            </View>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Ionicons name="school" size={18} color={Colors.accent} />
            <View style={styles.info}>
              <Text style={styles.label}>Proyecto</Text>
              <Text style={styles.value}>Agregador y Analizador de Datos IoT</Text>
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
    padding: 16,
  },
  header: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  info: {
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
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  endpoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    gap: 10,
  },
  endpointBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  endpointInfo: {
    flex: 1,
  },
  endpointPath: {
    color: Colors.text,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  endpointDesc: {
    color: Colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
});
