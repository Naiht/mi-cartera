import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";

import { t } from '@/i18n';

const TopTabs = createMaterialTopTabNavigator();
export const Tabs = withLayoutContext(TopTabs.Navigator);

export default function TabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      {/* ================= HEADER FIJO ================= */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: Colors[theme].header,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: Colors[theme].textHeader,
          }}
        >
          Mi Cartera
        </Text>

      </View>

      {/* ================= TABS ================= */}
      <Tabs
        screenOptions={{
          swipeEnabled: true,

          tabBarStyle: {
            backgroundColor: Colors[theme].card,
            elevation: 0,
          },

          tabBarIndicatorStyle: {
            backgroundColor: Colors[theme].primary,
            height: 3,
            borderRadius: 3,
          },

          tabBarItemStyle: {
            flexDirection: "column",
            paddingVertical: 6,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            textTransform: "none",
            marginTop: 2,
          },

          tabBarActiveTintColor: Colors[theme].primary,
          tabBarInactiveTintColor: Colors[theme].textMuted,

          tabBarShowIcon: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            //@ts-ignore
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="dashboard" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="gastos"
          options={{
            title: t('tabs.expenses'),
            //@ts-ignore
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="receipt-long" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="ingresos"
          options={{
            title: t('tabs.income'),
            //@ts-ignore
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="wallet" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            //@ts-ignore
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
