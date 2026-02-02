import { View, Text, Pressable, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (start: Date, end: Date) => void;
};

export function DateRangePicker({ visible, onClose, onConfirm }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const confirm = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)", paddingBottom: insets.bottom 
        }}
      >
        <View
          style={{
            backgroundColor: Colors[theme].card,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: Colors[theme].text,
              marginBottom: 12,
            }}
          >
            Seleccionar rango de fechas
          </Text>

          {/* Fecha inicio */}
          <Pressable
            onPress={() => setShowStart(true)}
            style={{ marginBottom: 12 }}
          >
            <Text style={{ color: Colors[theme].textMuted }}>Desde</Text>
            <Text style={{ color: Colors[theme].text }}>
              {startDate.toLocaleDateString()}
            </Text>
          </Pressable>

          {/* Fecha fin */}
          <Pressable
            onPress={() => setShowEnd(true)}
            style={{ marginBottom: 16 }}
          >
            <Text style={{ color: Colors[theme].textMuted }}>Hasta</Text>
            <Text style={{ color: Colors[theme].text }}>
              {endDate.toLocaleDateString()}
            </Text>
          </Pressable>

          {/* Pickers */}
          {showStart && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowStart(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          {showEnd && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => {
                setShowEnd(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          {/* Acciones */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Pressable onPress={onClose}>
              <Text style={{ color: Colors[theme].textMuted }}>Cancelar</Text>
            </Pressable>

            <Pressable onPress={confirm}>
              <Text
                style={{
                  color: Colors[theme].primary,
                  fontWeight: "600",
                }}
              >
                Aplicar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
