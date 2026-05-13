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

  const renderItem = ({ item }: { item: Factory }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
      onPress={() =>
        router.push({ pathname: "../../screens/fabrica", params: { id: item.id } })
      }
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="business" size={22} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subtitle}>ID: {item.id}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fábricas</Text>
      <Text style={styles.subheader}>{data.length} instalaciones registradas</Text>

      {loading && data.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} size="large" />
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="cloud-offline" size={40} color={Colors.muted} />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>
            </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
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
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={40} color={Colors.muted} />
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 2,
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
    paddingTop: 60,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  errorHint: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: 14,
  },
});
