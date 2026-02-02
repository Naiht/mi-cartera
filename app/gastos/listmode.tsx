import {
  View,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { Text } from "../../components/ui/Text";
import { BaseDatePicker } from "../../components/ui/BaseDatePicker";
import { BaseSelect } from "../../components/ui/BaseSelect";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../utils/formatDate";
import { getSettings } from "../../db/queries/settings";
import { getExpenseCategories } from "../../db/queries/categories";
import { getCurrencyById } from "../../utils/currency";
import {
  getExpenseListsForLoad,
  getExpenseListItemsForLoad,
} from "../../db/queries/expenseLists";

import { saveMultipleGastos } from "../../db/queries/gastos";
import { handleMontoChange } from "../../utils/onlyNumber";

type GastoItem = {
  id: string;
  descripcion: string;
  monto: string;
  fecha: Date;
  categoria: string;
};

export default function ListMode() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [items, setItems] = useState<GastoItem[]>([]);
  const [currency, setCurrency] = useState("C$");
  const [categories, setCategories] = useState<any[]>([]);

  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [lists, setLists] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const settings = await getSettings();
        if (settings) {
          const currencyData = getCurrencyById(settings.currency_id);
          setCurrency(currencyData.symbol);
        }
        const cats = await getExpenseCategories();
        setCategories(cats);
      })();
    }, []),
  );

  async function openLoadModal() {
    const data = await getExpenseListsForLoad();
    setLists(data);
    setLoadModalVisible(true);
  }

  /* =======================
     Load selected list
  ======================= */
  async function loadTemplate(templateId: number) {
    const rows = await getExpenseListItemsForLoad(templateId);

    const today = new Date();

    setItems(
      rows.map((r) => ({
        id: Date.now().toString() + Math.random(),
        descripcion: r.description,
        monto: r.amount?.toString() ?? "",
        categoria: String(r.category_id),
        fecha: today,
      })),
    );

    setLoadModalVisible(false);

    Toast.show({
      type: "success",
      text1: "Lista cargada",
    });
  }

  /* =======================
     Item handlers
  ======================= */

  function addNewItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        descripcion: "",
        monto: "",
        fecha: new Date(),
        categoria: categories[0]?.id?.toString() ?? "",
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

  const total = items.reduce((sum, item) => sum + (Number(item.monto) || 0), 0);

  const selectData = categories.map((cat) => ({
    label: cat.name,
    value: String(cat.id),
  }));

  /* =======================
     Render
  ======================= */

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nueva lista de gastos",

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
          ListHeaderComponent={
            <>
              {/* Cargar lista */}
              <Pressable
                onPress={openLoadModal}
                style={({ pressed }) => ({
                  backgroundColor: Colors[theme].third,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 16,
                })}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Cargar lista de gastos
                </Text>
              </Pressable>
            </>
          }
          renderItem={({ item }) => {
            const category = getCategoryById(categories, item.categoria);

            return (
              <View
                style={{
                  backgroundColor: Colors[theme].card,
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                {/* HEADER: Descripción + Monto */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    value={item.descripcion}
                    onChangeText={(text) =>
                      updateItem(item.id, "descripcion", text)
                    }
                    placeholder="Sin descripción"
                    placeholderTextColor={Colors[theme].textMuted}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: "600",
                      color: Colors[theme].text,
                      paddingVertical: 4,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: Colors[theme].textMuted,
                        marginLeft: 4,
                      }}
                    >
                      {currency}
                    </Text>

                    <TextInput
                      value={item.monto}
                      onChangeText={(text) =>
                        updateItem(item.id, "monto", handleMontoChange(text))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor={Colors[theme].textMuted}
                      style={{
                        minWidth: 40,
                        textAlign: "right",
                        fontSize: 16,
                        fontWeight: "700",
                        color: Colors[theme].primary,
                        paddingVertical: 4,
                      }}
                    />
                  </View>
                </View>

                {/* INFO INLINE: Fecha + Categoría */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors[theme].textMuted,
                      marginRight: 12,
                    }}
                  >
                    📅 {formatDate(item.fecha)}
                  </Text>

                  {category && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: category.color,
                          marginRight: 6,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors[theme].textMuted,
                        }}
                      >
                        {category.name}
                      </Text>
                    </View>
                  )}
                </View>

                {/* SELECTORES */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  {/* FECHA */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: Colors[theme].textMuted,
                        marginBottom: 4,
                      }}
                    >
                      Fecha
                    </Text>

                    <BaseDatePicker
                      value={item.fecha}
                      onChange={(date) => updateItem(item.id, "fecha", date)}
                    />
                  </View>

                  {/* CATEGORÍA */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 11,
                        color: Colors[theme].textMuted,
                        marginBottom: 4,
                      }}
                    >
                      Categoría
                    </Text>

                    <BaseSelect
                      value={item.categoria}
                      onChange={(value) =>
                        updateItem(item.id, "categoria", value)
                      }
                      options={selectData}
                    />
                  </View>
                </View>

                {/* DIVISOR */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: Colors[theme].border,
                    marginVertical: 10,
                  }}
                />

                {/* ELIMINAR */}
                <Pressable
                  onPress={() => removeItem(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: pressed
                      ? Colors[theme].background
                      : "transparent",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text
                    style={{
                      color: "#EF4444",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    Eliminar
                  </Text>
                </Pressable>
              </View>
            );
          }}
          ListFooterComponent={
            <>
              {/* Nuevo item */}
              <Pressable
                onPress={addNewItem}
                style={({ pressed }) => ({
                  backgroundColor: Colors[theme].secondary,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 16,
                })}
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
                onPress={() => {
                  Alert.alert(
                    "Guardar gastos",
                    `Se guardarán ${items.length} gastos.\n¿Deseas continuar?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Guardar",
                        style: "default",
                        onPress: async () => {
                          try {
                            await saveMultipleGastos(
                              items.map((i) => ({
                                description: i.descripcion,
                                amount: Number(i.monto) || 0,
                                date: i.fecha.toISOString().split("T")[0],
                                category_id: Number(i.categoria),
                              })),
                            );

                            Toast.show({
                              type: "success",
                              text1: "Gastos guardados",
                              text2: `${items.length} registros insertados`,
                            });

                            Haptics.notificationAsync(
                              Haptics.NotificationFeedbackType.Success,
                            );

                            router.back();
                          } catch (err) {
                            console.error(err);
                            Toast.show({
                              type: "error",
                              text1: "Error",
                              text2: "No se pudieron guardar los gastos",
                            });
                          }
                        },
                      },
                    ],
                  );
                }}
                style={({ pressed }) => ({
                  backgroundColor: Colors[theme].primary,
                  padding: 16,
                  borderRadius: 12,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  alignItems: "center",
                })}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Guardar gastos
                </Text>
              </Pressable>
            </>
          }
        />
      </KeyboardAvoidingView>

      {/* MODAL CARGAR LISTA */}
      <Modal transparent visible={loadModalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: Colors[theme].card,
              borderRadius: 22,
              padding: 20,
              maxHeight: "75%",
            }}
          >
            {/* TÍTULO */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 16,
                textAlign: "center",
                color: Colors[theme].text,
              }}
            >
              Cargar lista predefinida
            </Text>

            {/* LISTAS */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {lists.map((l) => (
                <Pressable
                  key={l.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    loadTemplate(l.id);
                  }}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    borderRadius: 16,
                    backgroundColor: pressed
                      ? Colors[theme].background
                      : "transparent",
                    marginBottom: 10,
                  })}
                >
                  {/* ICONO */}
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: Colors[theme].primary + "22",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <MaterialIcons
                      name="playlist-play"
                      size={22}
                      color={Colors[theme].primary}
                    />
                  </View>

                  {/* INFO */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: Colors[theme].text,
                      }}
                    >
                      {l.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors[theme].textMuted,
                        marginTop: 2,
                      }}
                    >
                      {l.item_count ?? 0} elementos ·{" "}
                      {Number(l.total_amount ?? 0).toFixed(2)} {currency}
                    </Text>
                  </View>

                  {/* CHEVRON */}
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={Colors[theme].textMuted}
                  />
                </Pressable>
              ))}

              {lists.length === 0 && (
                <View style={{ paddingVertical: 24, alignItems: "center" }}>
                  <Text style={{ color: Colors[theme].textMuted }}>
                    No hay listas disponibles
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* DIVISOR */}
            <View
              style={{
                height: 1,
                backgroundColor: Colors[theme].third,
                marginVertical: 14,
              }}
            />

            {/* CANCELAR */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setLoadModalVisible(false);
              }}
              style={({ pressed }) => ({
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
                backgroundColor: pressed
                  ? Colors[theme].background
                  : "transparent",
              })}
            >
              <Text
                style={{
                  color: Colors[theme].textMuted,
                  fontWeight: "500",
                }}
              >
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ===== Helpers ===== */

const input = (theme: "light" | "dark") => ({
  backgroundColor: Colors[theme].background,
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  color: Colors[theme].text,
});

function getCategoryById(categories: any[], id: string) {
  return categories.find((c) => String(c.id) === String(id));
}
