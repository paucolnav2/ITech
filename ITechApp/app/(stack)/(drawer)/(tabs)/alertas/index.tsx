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

  const alertMachines = useMemo(
    () => machines.filter((m) => !m.hasGreenState),
    [machines],
  );

  const onRefresh = () => {
    refetch();
    refetchMachines();
  };

  const listHeader = alertMachines.length > 0 ? (
    <View style={styles.alertMachinesSection}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name="warning" size={16} color={Colors.danger} />
        <Text style={styles.sectionTitle}>
          Máquinas en alerta ({alertMachines.length})
        </Text>
      </View>
      {alertMachines.map((m: Machine) => (
        <View key={m.id} style={styles.alertMachineRow}>
          <View style={styles.alertDot} />
          <Ionicons name="hardware-chip" size={16} color={Colors.danger} />
          <Text style={styles.alertMachineName}>{m.name}</Text>
          <Text style={styles.alertMachineId}>#{m.id}</Text>
        </View>
      ))}
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alertas y Anomalías</Text>
      <Text style={styles.subheader}>
        Eventos críticos detectados por los sensores
      </Text>

      {loading && data.length === 0 ? (
        <ActivityIndicator
          color={Colors.primary}
          style={styles.loader}
          size="large"
        />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : data.length === 0 ? (
        <>
          {listHeader}
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle" size={48} color={Colors.success} />
            <Text style={styles.emptyTitle}>Sin anomalías activas</Text>
            <Text style={styles.emptyText}>
              Todos los sensores están dentro de los rangos normales
            </Text>
          </View>
        </>
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
    padding: 16,
  },
  header: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },
  subheader: {
    color: Colors.muted,
    fontSize: 13,
    marginBottom: 20,
    marginTop: 4,
  },
  listHeader: {
    marginBottom: 16,
  },
  alertMachinesSection: {
    backgroundColor: Colors.danger + "12",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  alertMachineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.danger + "25",
  },
  alertDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  alertMachineName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  alertMachineId: {
    color: Colors.muted,
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 60,
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 30,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.success,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
});
