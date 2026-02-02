import { View, Pressable, ScrollView, Modal, TextInput } from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { Text } from "../../components/ui/Text";
import { useEffect, useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { getSettings } from "../../db/queries/settings";
import { getCurrencyById } from "../../utils/currency";
import {
  getExpenseListTemplates,
  createExpenseList,
  updateExpenseListName,
  toggleExpenseListVisibility,
  deleteExpenseList,
} from "../../db/queries/expenseLists";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DefaultListsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [lists, setLists] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("C$");

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      if (settings) {
        const currencyData = getCurrencyById(settings.currency_id);
        setCurrency(currencyData.symbol);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, []),
  );

  async function loadLists() {
    const data = await getExpenseListTemplates();
    setLists(data);
  }

  function openCreateModal() {
    setEditingId(null);
    setName("");
    setModalVisible(true);
  }

  function openEditModal(item: any) {
    setEditingId(item.id);
    setName(item.name);
    setModalVisible(true);
  }

  async function saveList() {
    if (!name.trim()) return;

    if (editingId) {
      await updateExpenseListName(editingId, name.trim());
      Toast.show({
        type: "success",
        text1: "Lista actualizada",
      });
    } else {
      await createExpenseList(name.trim());
      Toast.show({
        type: "success",
        text1: "Lista creada",
      });
    }

    setName("");
    setEditingId(null);
    setModalVisible(false);
    loadLists();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
    >
      <Stack.Screen
        options={{
          title: "Gastos predefinidos",
          headerTitleStyle: {
            color: Colors[theme].textHeader,
            fontWeight: "600",
          },
          headerTintColor: Colors[theme].textHeader,
        }}
      />

      {/* NUEVA LISTA */}
      <Pressable
        onPress={openCreateModal}
        style={{
          backgroundColor: Colors[theme].secondary,
          padding: 14,
          marginBottom: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Nueva lista</Text>
      </Pressable>

      {/* LISTAS */}
      {lists.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            router.push(
              `/settings/defaultslistedit?id=${item.id}&name=${item.name}`,
            )
          }
          style={({ pressed }) => ({
            padding: 16,
            borderRadius: 12,
            backgroundColor: Colors[theme].card,
            marginBottom: 8,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{ fontWeight: "600", marginBottom: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>

          <Text style={{ color: Colors[theme].textMuted, fontSize: 13 }}>
            {item.item_count} elementos · {item.total_amount.toFixed(2)}{" "}
            {currency}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 8 }}>
            {/* EDITAR */}
            <Pressable
              onPress={() => openEditModal(item)}
              style={{ marginRight: 16 }}
            >
              <MaterialIcons name="edit" size={20} color={Colors[theme].text} />
            </Pressable>

            {/* VISIBILIDAD */}
            <Pressable
              onPress={() =>
                toggleExpenseListVisibility(item.id, item.estado ? 0 : 1).then(
                  loadLists,
                )
              }
              style={{ marginRight: 16 }}
            >
              <MaterialIcons
                name={item.estado ? "visibility" : "visibility-off"}
                size={20}
                color={Colors[theme].text}
              />
            </Pressable>

            {/* ELIMINAR */}
            <Pressable
              onPress={() => deleteExpenseList(item.id).then(loadLists)}
            >
              <MaterialIcons name="delete" size={20} color="#EF4444" />
            </Pressable>
          </View>
        </Pressable>
      ))}

      {/* MODAL CREAR / EDITAR */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: Colors[theme].card,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 12 }}>
              {editingId ? "Editar lista" : "Nueva lista"}
            </Text>

            <TextInput
              placeholder="Nombre de la lista"
              placeholderTextColor={Colors[theme].textMuted + "AA"}
              value={name}
              onChangeText={setName}
              style={{
                backgroundColor: Colors[theme].background,
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                color: Colors[theme].text,
              }}
            />

            <Pressable
              onPress={saveList}
              style={{
                backgroundColor: Colors[theme].primary,
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
