import { Colors } from "@/constants/theme";
import { useFactories } from "@/hooks/useFactories";
import { Factory } from "@/interfaces/factory.interface";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Fabricas = () => {
  const { data, loading, error, refetch } = useFactories();

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.header}>Instalaciones</Text>
          <Text style={styles.subheader}>
            {data.length > 0
              ? `${data.length} fábricas registradas en el sistema`
              : "Gestión de fábricas industriales"}
          </Text>
        </View>
      </View>

      {loading && data.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} size="large" />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={48} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }: { item: Factory }) => (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
              onPress={() =>
                router.push({ pathname: "../../screens/fabrica", params: { id: item.id } })
              }
            >
              <View style={styles.cardTop}>
                <View style={styles.iconWrap}>
                  <Ionicons name="business" size={28} color={Colors.primary} />
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
              </View>
              <Text style={styles.factoryName}>{item.name}</Text>
              <Text style={styles.factoryId}>ID: {item.id}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={48} color={Colors.muted} />
              <Text style={styles.emptyText}>No hay fábricas registradas</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Fabricas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  pageHeader: {
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
  row: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
    minWidth: 200,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  factoryName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  factoryId: {
    color: Colors.muted,
    fontSize: 12,
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
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 15,
  },
});
