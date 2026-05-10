import MachineCard from "@/components/MachineCard";
import { Colors } from "@/constants/theme";
import { useFactory, useFactoryMachines } from "@/hooks/useFactories";
import { useSensors } from "@/hooks/useSensors";
import { Machine } from "@/interfaces/machine.interface";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { setParams } from "expo-router/build/global-state/routing";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FabricaDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const factoryId = Number(id);

  const { data: factory, loading: loadingFactory, error: errorFactory } = useFactory(factoryId);
  const { data: machines, loading: loadingMachines, error: errorMachines } = useFactoryMachines(factoryId);
  const { data: sensors } = useSensors();

  const sensorCountByMachine = useMemo(() => {
    const map: Record<number, number> = {};
    sensors.forEach((s) => {
      map[s.machineID] = (map[s.machineID] ?? 0) + 1;
    });
    return map;
  }, [sensors]);

  const alertCount = machines.filter((m) => !m.hasGreenState).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.factoryCard}>
        <View style={styles.factoryHeader}>
          <View style={styles.iconWrap}>
            <Ionicons name="business" size={28} color={Colors.primary} />
          </View>
          <View style={styles.factoryInfo}>
            <Text style={styles.factoryName}>
              {factory?.name ?? `Fábrica #${factoryId}`}
            </Text>
            <Text style={styles.factoryId}>ID: {factoryId}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{machines.length}</Text>
            <Text style={styles.statLabel}>Máquinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              {machines.length - alertCount}
            </Text>
            <Text style={styles.statLabel}>Operativas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: alertCount > 0 ? Colors.danger : Colors.muted }]}>
              {alertCount}
            </Text>
            <Text style={styles.statLabel}>En alerta</Text>
          </View>
        </View>

        {errorFactory && (
          <View style={styles.errorBanner}>
            <Ionicons name="information-circle" size={14} color={Colors.warning} />
            <Text style={styles.errorBannerText}>
              El endpoint /factories/{factoryId} aún no está implementado
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Máquinas</Text>

      {loadingMachines && machines.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : errorMachines ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={32} color={Colors.muted} />
          <Text style={styles.errorText}>{errorMachines}</Text>
        </View>
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: Machine }) => (
            <MachineCard
              machine={item}
              sensorCount={sensorCountByMachine[item.id]}
              onPress={() =>
                router.push("../maquina", setParams({ id: item.id }))
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="hardware-chip-outline" size={32} color={Colors.muted} />
              <Text style={styles.emptyText}>No hay máquinas en esta fábrica</Text>
            </View>
          }
        />
      )}
    </ScrollView>
  );
};

export default FabricaDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  factoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  factoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  factoryInfo: {
    flex: 1,
  },
  factoryName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  factoryId: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
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
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.cardBorder,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: Colors.warning + "15",
    borderRadius: 8,
    padding: 8,
  },
  errorBannerText: {
    color: Colors.warning,
    fontSize: 12,
    flex: 1,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 30,
  },
  loader: {
    marginTop: 30,
  },
  errorBox: {
    alignItems: "center",
    paddingTop: 30,
    gap: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingTop: 30,
    gap: 8,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
  },
});
