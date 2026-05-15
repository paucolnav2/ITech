import SensorTypeBadge from "@/components/SensorTypeBadge";
import { Colors, SensorTypeColors } from "@/constants/theme";
import { useMachines } from "@/hooks/useMachines";
import { useSensors } from "@/hooks/useSensors";
import { Sensor } from "@/interfaces/sensor.interface";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SENSOR_TYPES = ["TODOS", "TEMPERATURE", "HUMIDITY", "VIBRATION", "PRESSURE", "LIGHT", "SOUND", "MOISTURE"];

const Sensores = () => {
  const { data, loading, error, refetch } = useSensors();
  const { data: machines } = useMachines();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("TODOS");

  const machineStateMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    machines.forEach((m) => { map[m.id] = m.hasGreenState; });
    return map;
  }, [machines]);

  const countByType = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((s) => {
      s.sensorTypes.forEach((t) => { map[t] = (map[t] ?? 0) + 1; });
    });
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
    if (activeType !== "TODOS") {
      result = result.filter((s) => s.sensorTypes.includes(activeType));
    }
    if (query.trim()) {
      result = result.filter(
        (s) =>
          s.sensorName.toLowerCase().includes(query.toLowerCase()) ||
          s.sensorTypes.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          s.machineID.toString().includes(query),
      );
    }
    return result;
  }, [data, query, activeType]);

  const renderItem = ({ item }: { item: Sensor }) => {
    const machineIsGreen = machineStateMap[item.machineID] ?? true;
    return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: machineIsGreen ? Colors.success : Colors.danger },
        pressed && { opacity: 0.8 },
      ]}
      onPress={() =>
        router.push({ pathname: "/screens/sensor", params: { id: item.sensorID } })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          <Ionicons name="pulse" size={18} color={Colors.accent} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.sensorName} numberOfLines={1}>
            {item.sensorName}
          </Text>
          <Text style={styles.machineLabel}>Máquina #{item.machineID}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
      </View>
      <View style={styles.badgesRow}>
        {item.sensorTypes.map((type) => (
          <SensorTypeBadge key={type} type={type} />
        ))}
      </View>
    </Pressable>
  );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sensores</Text>
      <Text style={styles.subheader}>
        {data.length} sensores registrados en la planta
      </Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={Colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar sensor o máquina..."
          placeholderTextColor={Colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={16} color={Colors.muted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {SENSOR_TYPES.map((type) => {
          const isActive = activeType === type;
          const color = type === "TODOS" ? Colors.primary : (SensorTypeColors[type] ?? Colors.muted);
          const count = type === "TODOS" ? data.length : (countByType[type] ?? 0);
          return (
            <Pressable
              key={type}
              style={[styles.filterChip, isActive && { backgroundColor: color + "25", borderColor: color }]}
              onPress={() => setActiveType(type)}
            >
              <Text style={[styles.filterText, isActive && { color }]}>
                {type === "TODOS" ? "Todos" : type}
              </Text>
              <Text style={[styles.filterCount, isActive && { color }]}>{count}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading && data.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} size="large" />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.sensorID.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {query || activeType !== "TODOS" ? "Sin resultados para los filtros actuales" : "No hay sensores"}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default Sensores;

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
    marginBottom: 16,
    marginTop: 4,
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  filterText: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  filterCount: {
    color: Colors.muted,
    fontSize: 11,
    backgroundColor: Colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.accent + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  sensorName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  machineLabel: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8,
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
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    color: Colors.muted,
    textAlign: "center",
    marginTop: 40,
  },
});
