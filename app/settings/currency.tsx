import { View, Pressable, ScrollView } from "react-native";
import { Stack, router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { Text } from "../../components/ui/Text";
import { currencies } from "../../constants/currencies";
import { useEffect, useState, useRef } from "react";
import { getSettings, updateCurrency } from "../../db/queries/settings";
import Toast from "react-native-toast-message";

export default function CurrencyScreen() {
  const { theme } = useTheme();
  const lang: "es" | "en" = "es";

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const didLoad = useRef(false);

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    (async () => {
      const settings = await getSettings();
      if (settings) {
        setSelectedId(settings.currency_id);
      }
    })();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen
        options={{
          title: "Divisa",
          headerTitleStyle: {
            color: Colors[theme].textHeader,
            fontWeight: "600",
          },
          headerTintColor: Colors[theme].textHeader,
        }}
      />

      {currencies.map((c) => {
        const selected = c.id === selectedId;

        return (
          <Pressable
            key={c.id}
            onPress={async () => {
              setSelectedId(c.id);
              await updateCurrency(c.id);

              Toast.show({
                type: "success",
                text1: "Divisa Actualizada",
                text2: "Los cambios se guardaron correctamente",
              });

              router.back();
            }}
            style={({ pressed }) => ({
              padding: 16,
              borderRadius: 12,
              backgroundColor: selected
                ? Colors[theme].primary + "20"
                : Colors[theme].card,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", width: 40 }}>
              {c.symbol}
            </Text>

            <View>
              <Text style={{ fontWeight: "500" }}>{c.name[lang]}</Text>
              <Text style={{ color: Colors[theme].textMuted, fontSize: 12 }}>
                {c.code}
              </Text>
            </View>

            {selected && (
              <Text
                style={{ marginLeft: "auto", color: Colors[theme].primary }}
              >
                ✓
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
