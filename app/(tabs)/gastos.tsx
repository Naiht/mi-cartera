import { View, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { t } from "@/i18n";
import { Colors } from "../../constants/Colors";
import { PeriodSelect } from "../../components/ui/PeriodSelect";
import { formatPeriodLabel } from "../../utils/formatPeriod";
import { formatDate } from "../../utils/formatDate";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { FabMenu } from "../../components/ui/FabMenu";
import { Text } from "../../components/ui/Text";
import { getGastosByPeriod } from "../../db/queries/gastos";
import { getDateRange } from "../../utils/getDateRange";
import { getSettings } from "../../db/queries/settings";
import { getCurrencyById } from "../../utils/currency";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type Gasto = {
  id: number;
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
};

export default function GastosScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [period, setPeriod] = useState<"7" | "15" | "30" | "range">("30");
  const [showRange, setShowRange] = useState(false);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [currency, setCurrency] = useState("C$");

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  async function loadExpenses() {
    //cargar gastos
    const settings = await getSettings();
    if (settings) {
      const c = getCurrencyById(settings.currency_id);
      setCurrency(c.symbol);
    }
    //@ts-ignore
    const { start, end } = getDateRange(period, range ?? undefined);
    const rows = await getGastosByPeriod(start, end);

    setGastos(
      rows.map((r) => ({
        id: r.id,
        descripcion: r.description ?? t("expenses.noDescription"),
        categoria: r.category_name,
        monto: r.amount,
        fecha: r.date,
      })),
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [period, range]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      {/* Filtro */}
      <View style={{ padding: 14 }}>
        <PeriodSelect
          value={period}
          onChange={(value) => {
            setPeriod(value);

            if (value === "range") {
              setShowRange(true);
            } else {
              setRange(null);
            }
          }}
        />

        {period === "range" && (
          <View style={{ paddingHorizontal: 14, paddingBottom: 8 }}>
            <Pressable onPress={() => setShowRange(true)}>
              <Text
                style={{
                  color: Colors[theme].textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {formatPeriodLabel(period, range)}
              </Text>
            </Pressable>
          </View>
        )}

        <DateRangePicker
          visible={showRange}
          onClose={() => setShowRange(false)}
          onConfirm={(start, end) => {
            if (end < start) {
              Toast.show({
                type: "error",
                text1: t("expenses.invalidRangeTitle"),
                text2: t("expenses.invalidRangeMessage"),
              });
              return;
            }
            setRange({ start, end });
            console.log("Rango aplicado:", start, end);
          }}
        />
      </View>

      {/* Estado vacío */}
      {gastos.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <MaterialIcons
            name="receipt-long"
            size={64}
            color={Colors[theme].textMuted}
          />
          <Text
            style={{
              marginTop: 12,
              color: Colors[theme].textMuted,
              textAlign: "center",
            }}
          >
            {t("expenses.emptyState")}
          </Text>
        </View>
      )}

      {/* Lista */}
      {gastos.length > 0 && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 12,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                color: Colors[theme].text,
                marginRight: 8,
              }}
            >
              {t("expenses.listTitle")}
            </Text>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors[theme].decorator,
                opacity: 0.4,
              }}
            />
          </View>

          <FlatList
            data={gastos}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              padding: 10,
              paddingBottom: insets.bottom + 96,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors[theme].primary}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/gastos/form?id=${item.id}`)}
                style={({ pressed }) => ({
                  backgroundColor: Colors[theme].card,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                {/* Izquierda */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 2 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.descripcion}
                  </Text>

                  <Text
                    style={{ fontSize: 12, color: Colors[theme].textMuted }}
                  >
                    {item.categoria} · {formatDate(item.fecha)}
                  </Text>
                </View>

                {/* Derecha */}
                <Text
                  style={{
                    fontWeight: "700",
                    color: Colors[theme].danger,
                    marginLeft: 12,
                  }}
                >
                  {currency} {item.monto.toFixed(2)}
                </Text>
              </Pressable>
            )}
          />
        </>
      )}

      {/* FAB */}
      <FabMenu
        onSingle={() => router.push("/gastos/form")}
        onList={() => router.push("/gastos/listmode")}
      />
    </View>
  );
}
