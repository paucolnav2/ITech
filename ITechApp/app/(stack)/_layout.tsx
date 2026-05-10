import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.card },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/maquina/index"
        options={{ headerShown: true, title: "Detalle de Máquina" }}
      />
      <Stack.Screen
        name="screens/fabrica/index"
        options={{ headerShown: true, title: "Detalle de Fábrica" }}
      />
      <Stack.Screen
        name="screens/sensor/index"
        options={{ headerShown: true, title: "Detalle de Sensor" }}
      />
    </Stack>
  );
}
