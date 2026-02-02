import { Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

import { Colors } from "../constants/Colors";
import { runMigrations } from "../db/migrations";
import { seedDatabase } from "../db/seed";
import { initI18n } from '@/i18n';

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { resetDatabase } from "@/db/resetDB";


function AppStack() {
  const { theme } = useTheme(); 

  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,

        headerStyle: {
          backgroundColor: Colors[theme].header,
        },

        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "600",
        },

        headerTitleAlign: "center",
        headerShadowVisible: false,
        //@ts-ignore
        headerBackTitleVisible: false,
        headerTintColor: Colors[theme].text,

        animation: "slide_from_right",
        animationDuration: 200,

        presentation: "card",
        freezeOnBlur: false,
        detachPreviousScreen: true,

        contentStyle: {
          backgroundColor: Colors[theme].background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      //await resetDatabase();
      await runMigrations();
      await seedDatabase();
      initI18n(); // usa idioma del sistema
    })();
  }, []);

  return (
    <ThemeProvider>
      <AppStack />
      <Toast />
    </ThemeProvider>
  );
}
