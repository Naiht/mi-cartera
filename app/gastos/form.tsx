import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { handleMontoChange } from "../../utils/onlyNumber";
import { BaseDatePicker } from "../../components/ui/BaseDatePicker";
import { BaseSelect } from "../../components/ui/BaseSelect";
import Toast from "react-native-toast-message";
import { getExpenseCategories } from "../../db/queries/categories";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

//import { getCurrencyById } from "../../utils/currency";
//import { getSettings } from "../../db/queries/settings";

import {
  saveGasto,
  updateGasto,
  getGastoById,
  deleteGasto,
} from "../../db/queries/gastos";
import { toISODate } from "../../utils/toIsoDate";

export default function GastoForm() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const isEdit = Boolean(id);

  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [categoria, setCategoria] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [height, setHeight] = useState(100);

  function showConfirm({
    title,
    message,
    confirmText,
    onConfirm,
    destructive = false,
  }: {
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => Promise<void>;
    destructive?: boolean;
  }) {
    Alert.alert(title, message, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: confirmText,
        style: destructive ? "destructive" : "default",
        onPress: () => {
          onConfirm().catch(console.error);
        },
      },
    ]);
  }

  /* =========================
     CARGAR DATA
  ========================= */
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const cats = await getExpenseCategories();
        if (!isActive) return;

        setCategories(cats);

        if (id) {
          const gasto = await getGastoById(Number(id));
          if (gasto) {
            setDescripcion(gasto.description ?? "");
            setMonto(String(gasto.amount));
            setFecha(new Date(gasto.date));
            setCategoria(String(gasto.category_id));
          }
        } else {
          if (cats.length > 0) {
            setCategoria(String(cats[0].id));
          }
        }
      })();

      return () => {
        isActive = false;
      };
    }, [id]),
  );

  const selectData = categories.map((cat) => ({
    label: cat.name,
    value: String(cat.id),
  }));

  /* =========================
     GUARDAR
  ========================= */
  async function handleSave() {
    if (!monto || !categoria) {
      Alert.alert(
        "Datos incompletos",
        "Debes ingresar al menos el monto y la categoría",
      );
      return;
    }

    try {
      const payload = {
        description: descripcion,
        amount: Number(monto),
        date: toISODate(fecha),
        category_id: Number(categoria),
      };

      if (isEdit && id) {
        await updateGasto(Number(id), payload);
        //@ts-ignore
        Toast.show({
          type: "success",
          text1: "Gasto actualizado",
          text2: "Los cambios se guardaron correctamente",
        });
      } else {
        await saveGasto(payload);
        //@ts-ignore
        Toast.show({
          type: "success",
          text1: "Gasto guardado",
          text2: "El gasto se registró correctamente",
        });
      }

      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo guardar el gasto. Intenta nuevamente.");
    }
  }

  function handleDelete() {
    if (!isEdit || !id) return;

    showConfirm({
      title: "Eliminar gasto",
      message: "¿Estás seguro de eliminar este gasto?",
      confirmText: "Eliminar",
      destructive: true,
      onConfirm: async () => {
        await deleteGasto(Number(id));

        Toast.show({
          type: "success",
          text1: "Gasto eliminado",
          text2: "El gasto se eliminó correctamente",
        });

        router.back();
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[theme].background,
            padding: 16,
          }}
        >
          <Stack.Screen
            options={{
              title: isEdit ? "Editar gasto" : "Nuevo gasto",
              gestureEnabled: false,

              headerTitleStyle: {
                color: Colors[theme].textHeader,
                fontWeight: "600",
              },
              headerTintColor: Colors[theme].textHeader,
              contentStyle: {
                backgroundColor: Colors[theme].background,
              },
            }}
          />

          <Text style={{ color: Colors[theme].textMuted, marginBottom: 4 }}>
            Descripción
          </Text>
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Ej. Supermercado"
            placeholderTextColor={Colors[theme].textMuted}
            multiline
            scrollEnabled={false}
            maxLength={200}
            textAlignVertical="top"
            style={{
              minHeight: 100,
              backgroundColor: Colors[theme].card,
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              color: Colors[theme].text,
            }}
          />

          <Text style={{ color: Colors[theme].textMuted, marginBottom: 4 }}>
            Monto
          </Text>
          <TextInput
            value={monto}
            onChangeText={(text) => setMonto(handleMontoChange(text))}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors[theme].textMuted}
            style={{
              backgroundColor: Colors[theme].card,
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              color: Colors[theme].text,
            }}
          />

          <BaseDatePicker
            label="Fecha"
            value={fecha}
            onChange={(date) => {
              setFecha(
                new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              );
            }}
          />

          <BaseSelect
            label="Categoría"
            value={categoria}
            onChange={setCategoria}
            options={selectData}
          />

          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: Colors[theme].primary,
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {isEdit ? "Actualizar gasto" : "Guardar gasto"}
            </Text>
          </Pressable>

          {isEdit && (
            <Pressable
              onPress={handleDelete}
              style={{
                backgroundColor: Colors[theme].danger,
                padding: 14,
                marginTop: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Eliminar Gasto
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
