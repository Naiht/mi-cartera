import { ScrollView, Pressable, View } from "react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { Text } from "../../components/ui/Text";
import { PeriodSelect } from "../../components/ui/PeriodSelect";
import { StatCard } from "../../components/ui/StatCard";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { ExpensePie } from "../../components/charts/ExpensePie";
import { RecentExpenses } from "../../components/lists/RecentExpenses";
import { formatPeriodLabel } from "../../utils/formatPeriod";
import Toast from "react-native-toast-message";

import { useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getSettings } from "../../db/queries/settings";
import { getCurrencyById } from "../../utils/currency";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDateRange } from "../../utils/getDateRange";
import {
  getTotalGastosByPeriod,
  getGastosByCategory,
  getRecentGastosByPeriod,
} from "../../db/queries/gastos";

import { t } from "@/i18n";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [period, setPeriod] =
    useState<"7" | "15" | "30" | "range">("30");
  const [showRange, setShowRange] = useState(false);
  const [range, setRange] =
    useState<{ start: Date; end: Date } | null>(null);

  const [currency, setCurrency] = useState("C$");
  const [totalGastos, setTotalGastos] = useState(0);
  const [pieData, setPieData] =
    useState<{ x: string; y: number }[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const settings = await getSettings();
        if (settings) {
          const c = getCurrencyById(settings.currency_id);
          setCurrency(c.symbol);
        }

        const { start, end } = getDateRange(period, range ?? undefined);

        setTotalGastos(await getTotalGastosByPeriod(start, end));

        const byCategory = await getGastosByCategory(start, end);
        setPieData(
          byCategory.map((row) => ({
            x: row.category_name,
            y: row.total,
          })),
        );

        const recentRows = await getRecentGastosByPeriod(start, end);
        setRecent(
          recentRows.map((r) => ({
            id: r.id,
            title: r.description ?? t("dashboard.noDescription"),
            category: r.category_name,
            amount: r.amount,
          })),
        );
      })();
    }, [period, range]),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 24,
      }}
    >
      {/* Filtro */}
      <PeriodSelect
        value={period}
        onChange={(value) => {
          setPeriod(value);
          if (value === "range") setShowRange(true);
        }}
      />

      <Pressable onPress={() => setShowRange(true)}>
        <Text
          style={{
            marginBottom: 12,
            color: Colors[theme].textMuted,
            fontSize: 13,
          }}
        >
          {formatPeriodLabel(period, range)}
        </Text>
      </Pressable>

      <DateRangePicker
        visible={showRange}
        onClose={() => setShowRange(false)}
        onConfirm={(start, end) => {
          if (end < start) {
            Toast.show({
              type: "error",
              text1: t("common.invalidRange"),
              text2: t("common.invalidRangeDetail"),
            });
            return;
          }
          setRange({ start, end });
        }}
      />

      {/* Estado vacío */}
      {pieData.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <MaterialIcons
            name="home"
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
            {t("dashboard.empty")}
          </Text>
        </View>
      )}

      {pieData.length > 0 && (
        <>
          <StatCard
            type="gasto"
            amount={totalGastos}
            currency={currency}
            onPress={() => router.push("/gastos")}
          />

          <ExpensePie data={pieData} currency={currency} />

          <RecentExpenses currency={currency} items={recent} />
        </>
      )}
    </ScrollView>
  );
}
