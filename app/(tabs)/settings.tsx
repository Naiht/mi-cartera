import { View, Pressable, Switch } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { Colors } from "../../constants/Colors";
import { Text } from "../../components/ui/Text";
import { useTheme } from "../context/ThemeContext";

/* =========================
   COMPONENTES
========================= */

function SettingToggle({
  icon,
  label,
  color,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  color: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
      }}
    >
      <MaterialIcons name={icon} color={color} size={22} />
      <Text style={{ flex: 1, marginLeft: 12 }}>{label}</Text>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#9CA3AF", true: "#22C55E" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SettingNav({
  icon,
  label,
  color,
  onPress,
  disabled,
}: {
  icon: any;
  label: string;
  color: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: pressed ? color + "20" : "transparent",
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <MaterialIcons name={icon} color={color} size={22} />
      <Text style={{ flex: 1, marginLeft: 12 }}>{label}</Text>

      {!disabled && (
        <MaterialIcons name="chevron-right" color={color} size={24} />
      )}
    </Pressable>
  );
}

/* =========================
   SCREEN
========================= */

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();

  const appVersion =
    Constants.expoConfig?.version ??
    Constants.manifest?.version ??
    "N/A";

  const isDark = mode === "dark";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[theme].background,
        paddingBottom: insets.bottom + 24,
      }}
    >
      {/* ===== Preferencias ===== */}
      <View
        style={{
          backgroundColor: Colors[theme].card,
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 8,
          marginTop: 20,
          marginBottom: 16,
        }}
      >
        <SettingToggle
          icon="dark-mode"
          label="Modo oscuro"
          color={Colors[theme].text}
          value={isDark}
          onChange={(enabled) => {
            setMode(enabled ? "dark" : "light");
          }}
        />

        <SettingNav
          icon="language"
          label="Idioma"
          color={Colors[theme].text}
          disabled
        />
      </View>

      {/* ===== Configuración ===== */}
      <View
        style={{
          backgroundColor: Colors[theme].card,
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 8,
          marginBottom: 16,
        }}
      >
        <SettingNav
          icon="paid"
          label="Divisa"
          color={Colors[theme].text}
          onPress={() => router.push("/settings/currency")}
        />

        <SettingNav
          icon="my-library-books"
          label="Categorías"
          color={Colors[theme].text}
          onPress={() => router.push("/settings/categories")}
        />

        <SettingNav
          icon="list"
          label="Gastos predefinidos"
          color={Colors[theme].text}
          onPress={() => router.push("/settings/defaultlist")}
        />
      </View>

      {/* ===== App ===== */}
      <View
        style={{
          backgroundColor: Colors[theme].card,
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 8,
        }}
      >
        <SettingNav
          icon="wallet"
          label="Mi Cartera"
          color={Colors[theme].text}
          disabled
        />

        <SettingNav
          icon="info"
          label={`Versión ${appVersion}`}
          color={Colors[theme].text}
          disabled
        />

        <SettingNav
          icon="code"
          label="Cristhian Morales · 2026"
          color={Colors[theme].text}
          disabled
        />
      </View>
    </View>
  );
}
