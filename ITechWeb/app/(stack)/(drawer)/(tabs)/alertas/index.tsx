import AnomalyCard from "@/components/AnomalyCard";
import { Colors } from "@/constants/theme";
import { useAnomalies } from "@/hooks/useAnomalies";
import { useMachines } from "@/hooks/useMachines";
import { Anomaly } from "@/interfaces/anomaly.interface";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
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
  const { data: machines, refetch: refetchMachines } = useMachines();

  const criticalCount = data.length;
  const alertMachines = useMemo(
    () => machines.filter((m) => !m.hasGreenState),
    [machines],
  );

  const onRefresh = () => {
    refetch();
    refetchMachines();
  };

  const listHeader = (
    <>
      {alertMachines.length > 0 && (
        <View style={styles.alertMachinesSection}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="warning" size={16} color={Colors.danger} />
            <Text style={styles.sectionTitle}>
              Máquinas en alerta ({alertMachines.length})
            </Text>
          </View>
          <View style={styles.alertMachinesGrid}>
            {alertMachines.map((m: Machine) => (
              <View key={m.id} style={styles.alertMachineChip}>
                <Ionicons name="hardware-chip" size={14} color={Colors.danger} />
                <Text style={styles.alertMachineName}>{m.name}</Text>
                <Text style={styles.alertMachineId}>#{m.id}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={styles.summaryBar}>
        <Ionicons name="information-circle" size={16} color={Colors.warning} />
        <Text style={styles.summaryText}>
          Mostrando {criticalCount} anomalía{criticalCount !== 1 ? "s" : ""} reciente{criticalCount !== 1 ? "s" : ""}
        </Text>
      </View>
    </>
  );

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
        <FlatList
          data={data}
          keyExtractor={(item, idx) => `${item.sensorId}-${item.dateAndTime}-${idx}`}
          renderItem={({ item }: { item: Anomaly }) => <AnomalyCard anomaly={item} />}
          ListHeaderComponent={listHeader}
          ListHeaderComponentStyle={styles.listHeader}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={Colors.danger}
            />
          }
          showsVerticalScrollIndicator={false}
        />
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
  listHeader: {
    marginBottom: 14,
  },
  alertMachinesSection: {
    backgroundColor: Colors.danger + "12",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },
  alertMachinesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  alertMachineChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.danger + "20",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  alertMachineName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  alertMachineId: {
    color: Colors.muted,
    fontSize: 12,
  },
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
