import { Colors } from "@/constants/theme";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: Colors.card },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
        sceneContainerStyle: { backgroundColor: Colors.background },
        drawerStyle: { backgroundColor: Colors.card, width: 260 },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.muted,
        drawerLabelStyle: { fontSize: 15 },
        drawerType: "permanent",
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Panel de Control" }} />
      <Drawer.Screen name="fabricas/index" options={{ title: "Fábricas" }} />
      <Drawer.Screen name="ajustes/index" options={{ title: "Ajustes" }} />
    </Drawer>
  );
}
