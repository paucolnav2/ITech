import AnomalyCard from "@/components/AnomalyCard";
import { Colors } from "@/constants/theme";
import { useAnomalies } from "@/hooks/useAnomalies";
import { Anomaly } from "@/interfaces/anomaly.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Alertas = () => {
  const { data, loading, error, refetch } = useAnomalies();

  const criticalCount = data.length;

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.header}>Alertas y Anomalías</Text>
          <Text style={styles.subheader}>
            Eventos críticos detectados por sensores IoT industriales
          </Text>
        </View>
        {criticalCount > 0 && (
          <View style={styles.criticalBadge}>
            <Ionicons name="warning" size={16} color={Colors.danger} />
            <Text style={styles.criticalText}>{criticalCount} activas</Text>
          </View>
        )}
      </View>

      {loading && data.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} size="large" />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={48} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>
            El endpoint /anomalies aún no está implementado en el servidor Java.{"\n"}
            Añadir ruta en HTTPHandler que retorne las filas de sensor_data donde is_anomaly = TRUE.
          </Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-done-circle" size={64} color={Colors.success} />
          <Text style={styles.emptyTitle}>Sin anomalías activas</Text>
          <Text style={styles.emptyText}>
            Todos los sensores reportan valores dentro de los rangos seguros
          </Text>
        </View>
      ) : (
        <View style={styles.listWrapper}>
          <View style={styles.summaryBar}>
            <Ionicons name="information-circle" size={16} color={Colors.warning} />
            <Text style={styles.summaryText}>
              Mostrando {data.length} anomalía{data.length !== 1 ? "s" : ""} reciente{data.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, idx) =>
              `${item.sensorId}-${item.dateAndTime}-${idx}`
            }
            renderItem={({ item }: { item: Anomaly }) => (
              <AnomalyCard anomaly={item} />
            )}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                tintColor={Colors.danger}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default Alertas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  header: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  subheader: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  criticalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.danger + "20",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  criticalText: {
    color: Colors.danger,
    fontWeight: "bold",
    fontSize: 13,
  },
  listWrapper: {
    flex: 1,
  },
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    backgroundColor: Colors.warning + "15",
    borderRadius: 8,
    padding: 10,
  },
  summaryText: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: "500",
  },
  list: {
    paddingBottom: 30,
  },
  loader: {
    marginTop: 60,
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 60,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorHint: {
    color: Colors.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 60,
  },
  emptyTitle: {
    color: Colors.success,
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
});
