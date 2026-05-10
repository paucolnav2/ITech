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

  const renderItem = ({ item }: { item: Anomaly }) => (
    <AnomalyCard anomaly={item} />
  );

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
          <Text style={styles.errorHint}>
            El endpoint /anomalies aún no está implementado en el servidor Java
          </Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="checkmark-done-circle" size={48} color={Colors.success} />
          <Text style={styles.emptyTitle}>Sin anomalías activas</Text>
          <Text style={styles.emptyText}>
            Todos los sensores están dentro de los rangos normales
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, idx) =>
            `${item.sensorId}-${item.dateAndTime}-${idx}`
          }
          renderItem={renderItem}
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
  errorHint: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 30,
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
