import {
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Text } from "../../components/ui/Text";
import { BaseSelect } from "../../components/ui/BaseSelect";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { handleMontoChange } from "../../utils/onlyNumber";

import { getSettings } from "../../db/queries/settings";
import { getExpenseCategories } from "../../db/queries/categories";
import { getCurrencyById } from "../../utils/currency";
import {
  getExpenseListItems,
  saveExpenseListItems,
} from "../../db/queries/expenseLists";

type GastoItem = {
  id: string;
  descripcion: string;
  monto: string;
  categoria: string;
};

export default function DefaultListsEditScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const templateId = Number(id);

  const isValidTemplate = Number.isFinite(templateId) && templateId > 0;

  const [items, setItems] = useState<GastoItem[]>([]);
  const [hasSaved, setHasSaved] = useState(false);

  const [currency, setCurrency] = useState("C$");
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  
  const hasChanges = useMemo(
    () => items.some((i) => i.descripcion.trim() !== "" || Number(i.monto) > 0),
    [items],
  );

  
  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        try {
          setLoading(true);

          // settings
          const settings = await getSettings();
          if (settings && active) {
            const currencyData = getCurrencyById(settings.currency_id);
            setCurrency(currencyData.symbol);
          }

          // categories
          const cats = await getExpenseCategories();
          if (active) {
            setCategories(cats);
          }

          // items (solo si templateId es válido)
          if (isValidTemplate) {
            const rows = await getExpenseListItems(templateId);
            if (active) {
              setItems(
                rows.map((r) => ({
                  id: String(r.id),
                  descripcion: r.description ?? "",
                  monto: r.amount?.toString() ?? "",
                  categoria: r.category_id ? String(r.category_id) : "",
                })),
              );
            }
          } else {
            // Si no hay template válido, evita crashear y deja vacío
            if (active) setItems([]);
          }
        } catch (e) {
          console.error(e);
          if (active) {
            Toast.show({
              type: "error",
              text1: "Error al cargar",
              text2: "Intenta nuevamente",
            });
          }
        } finally {
          if (active) setLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, [templateId, isValidTemplate]),
  );

  
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (hasSaved || !hasChanges) return;

      e.preventDefault();

      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Deseas salir?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      );
    });

    return unsubscribe;
  }, [navigation, hasSaved, hasChanges]);

  const selectData = useMemo(
    () =>
      categories.map((cat: any) => ({
        label: cat.name,
        value: String(cat.id),
      })),
    [categories],
  );

  function addNewItem() {
    if (categories.length === 0) {
      Toast.show({
        type: "error",
        text1: "Categorías no cargadas",
        text2: "Espera un momento e intenta de nuevo",
      });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        descripcion: "",
        monto: "",
        categoria: String(categories[0].id),
      },
    ]);
  }

  function updateItem(id: string, field: keyof GastoItem, value: any) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.monto) || 0), 0),
    [items],
  );

  async function handleSave() {
    if (!isValidTemplate) {
      Toast.show({
        type: "error",
        text1: "Lista inválida",
        text2: "No se pudo identificar la lista",
      });
      return;
    }

    try {
      // Evita guardar items totalmente vacíos
      const cleaned = items.filter(
        (i) => i.descripcion.trim() !== "" || Number(i.monto) > 0,
      );

      await saveExpenseListItems(
        templateId,
        cleaned.map((i) => ({
          descripcion: i.descripcion,
          monto: Number(i.monto) || 0,
          categoria: i.categoria,
        })),
      );

      Toast.show({
        type: "success",
        text1: "Lista guardada",
      });

      setHasSaved(true);
      router.back();
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "No se pudo guardar",
      });
    }
  }


  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: name ?? "Editar lista",
            headerTitleStyle: {
              color: Colors[theme].textHeader,
              fontWeight: "600",
            },
            headerTintColor: Colors[theme].textHeader,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[theme].background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator />
          <View style={{ height: 10 }} />
          <Text style={{ color: Colors[theme].textMuted }}>Cargando…</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: name ?? "Editar lista",
          headerTitleStyle: {
            color: Colors[theme].textHeader,
            fontWeight: "600",
          },
          headerTintColor: Colors[theme].textHeader,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 120,
          }}
          style={{ backgroundColor: Colors[theme].background }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: Colors[theme].card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              {/* DESCRIPCIÓN */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: Colors[theme].textMuted,
                    marginBottom: 4,
                  }}
                >
                  Descripción
                </Text>

                <TextInput
                  value={item.descripcion}
                  onChangeText={(text) =>
                    updateItem(item.id, "descripcion", text)
                  }
                  placeholder="Ej. Supermercado"
                  placeholderTextColor={Colors[theme].textMuted}
                  style={input(theme)}
                />
              </View>

              {/* MONTO */}
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: Colors[theme].textMuted,
                    marginBottom: 4,
                  }}
                >
                  Monto
                </Text>

                <TextInput
                  value={item.monto}
                  onChangeText={(text) =>
                    updateItem(item.id, "monto", handleMontoChange(text))
                  }
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={Colors[theme].textMuted}
                  style={input(theme)}
                />
              </View>

              <BaseSelect
                label="Categoría"
                value={item.categoria}
                onChange={(value) => updateItem(item.id, "categoria", value)}
                options={selectData}
              />

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors[theme].border,
                  marginVertical: 5,
                }}
              />

              <Pressable
                onPress={() => removeItem(item.id)}
                style={{ marginTop: 8, alignItems: "center" }}
              >
                <Text style={{ color: "#EF4444" }}>Eliminar elemento</Text>
              </Pressable>
            </View>
          )}
          ListFooterComponent={
            <>
              <Pressable
                onPress={addNewItem}
                style={{
                  backgroundColor: Colors[theme].secondary,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  + Agregar nuevo elemento
                </Text>
              </Pressable>

              <View style={{ alignItems: "center", marginVertical: 12 }}>
                <Text>
                  Total: {total.toFixed(2)} {currency}
                </Text>
              </View>

              <Pressable
                onPress={handleSave}
                style={{
                  backgroundColor: Colors[theme].primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: insets.bottom + 16,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Guardar lista
                </Text>
              </Pressable>
            </>
          }
        />
      </KeyboardAvoidingView>
    </>
  );
}

const input = (theme: "light" | "dark") => ({
  backgroundColor: Colors[theme].background,
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  color: Colors[theme].text,
});
