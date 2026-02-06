import { View, Pressable, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { Text } from "../../components/ui/Text";
import { useEffect, useState, useRef } from "react";
import { Modal, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ColorPicker from "react-native-wheel-color-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getExpenseCategories,
  stateCategorie,
  isCategoryInUse,
  updateCategorie,
  saveCategorie,
} from "../../db/queries/categories";
import Toast from "react-native-toast-message";

export default function categoriesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const isMountedRef = useRef(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#EF4444");

  useEffect(() => {
    isMountedRef.current = true;
    loadCategories();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function openCreateModal() {
    setEditingCategory(null);
    setName("");
    setColor("#EF4444");
    setModalVisible(true);
  }

  function openEditModal(category: any) {
    setEditingCategory(category);
    setName(category.name);
    setSelectedId(category.id);
    setColor(category.color);
    setModalVisible(true);
  }

  function isValidHex(value: string) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(value);
  }

  async function loadCategories() {
    try {
      const cats = await getExpenseCategories();

      if (!isMountedRef.current) return;

      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    if (!name || !color) {
      Alert.alert(
        "Datos incompletos",
        "Debes ingresar al menos el nombre y color para la categoria",
      );
      return;
    }

    try {
      const payload = {
        name: name,
        color: color,
      };

      if (editingCategory) {
        await updateCategorie(Number(selectedId), payload);
        Toast.show({
          type: "success",
          text1: "Categoria actualizada",
          text2: "Los cambios se guardaron correctamente",
        });
      } else {
        await saveCategorie(payload);
        Toast.show({
          type: "success",
          text1: "Categoria guardada",
          text2: "La categoria se registró correctamente",
        });
      }

      await loadCategories();

      if (!isMountedRef.current) return;

      setModalVisible(false);
      setEditingCategory(null);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          "No se pudo guardar la categoria. Intenta nuevamente.",
        );
      }
    }
  }

  async function handleState(removing: boolean, cate: any) {
    if (!selectedId) return;

    try {
      const categoryId = Number(selectedId);
      const inUse = await isCategoryInUse(categoryId);

      if (!isMountedRef.current) return;

      if (inUse) {
        Toast.show({
          type: "error",
          text1: "Categoría en uso",
          text2: "No se puede ocultar o eliminar una categoría en uso.",
        });
        return;
      }

      let newState = 0;//removing ? -1 : 0;

      removing ? newState = -1 : cate.estado == 0 ? newState = 1 : newState = 0;

      await stateCategorie(categoryId, newState);

      if (!isMountedRef.current) return;

      Toast.show({
        type: "success",
        text1: removing ? "Categoría eliminada" : "Visibilidad actualizada",
        text2: "Los cambios se guardaron correctamente",
      });

      await loadCategories();

      if (!isMountedRef.current) return;

      setSelectedId(null);
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          "Ocurrió un error al actualizar la categoría",
        );
      }
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Stack.Screen
        options={{
          title: "Categorias",
          headerTitleStyle: {
            color: Colors[theme].textHeader,
            fontWeight: "600",
          },
          headerTintColor: Colors[theme].textHeader,
        }}
      />

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
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Agregar Categoria
        </Text>
      </Pressable>

      {categories.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => openEditModal(c)}
          style={({ pressed }) => ({
            padding: 16,
            borderRadius: 12,
            backgroundColor: Colors[theme].card,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              backgroundColor: c.color,
              marginRight: 12,
            }}
          />

          <Text style={{ flex: 1, fontWeight: "500" }}>{c.name}</Text>

          <Pressable onPress={() => openEditModal(c)} style={{ marginLeft: 8 }}>
            <MaterialIcons name="edit" size={20} color={Colors[theme].text} />
          </Pressable>

          <Pressable
            onPress={() => {
              setSelectedId(c.id);
              handleState(false,c);
            }}
            style={{ marginLeft: 8 }}
          >
            <MaterialIcons
              name={c.estado == 0 ? "visibility-off" : "visibility"}
              size={20}
              color={Colors[theme].text}
            />
          </Pressable>

          <Pressable
            onPress={() => {
              setSelectedId(c.id);
              handleState(true,c);
            }}
            style={{ marginLeft: 8 }}
          >
            <MaterialIcons name="delete" size={20} color="#EF4444" />
          </Pressable>
        </Pressable>
      ))}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            padding: 24,
          }}
          onPress={() => setModalVisible(false)}
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
              {editingCategory ? "Editar categoría" : "Nueva categoría"}
            </Text>

            <TextInput
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors[theme].textMuted + "AA"}
              style={{
                backgroundColor: Colors[theme].background,
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                color: Colors[theme].text,
              }}
            />

            <View
              style={{
                width: "100%",
                height: 40,
                borderRadius: 8,
                backgroundColor: color,
                marginBottom: 12,
              }}
            />

            <TextInput
              placeholder="#EF4444"
              placeholderTextColor={Colors[theme].textMuted + "AA"}
              value={color}
              onChangeText={setColor}
              autoCapitalize="none"
              style={{
                backgroundColor: Colors[theme].background,
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                color: Colors[theme].text,
              }}
            />

            <View style={{ height: 220, marginBottom: 16 }}>
              <ColorPicker
                color={color}
                onColorChange={setColor}
                thumbSize={24}
                sliderSize={24}
                noSnap
                row={false}
              />
            </View>

            <Pressable
              onPress={async () => {
                if (!isValidHex(color)) {
                  Toast.show({
                    type: "error",
                    text1: "Color inválido",
                    text2: "Usa un color HEX válido",
                  });
                  return;
                }
                await handleSave();
              }}
              style={({ pressed }) => ({
                backgroundColor: Colors[theme].primary,
                padding: 14,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 20,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Guardar
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
