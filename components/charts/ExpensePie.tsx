import { View, Text, Dimensions } from "react-native";
import { VictoryPie } from "victory-native";
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from "../../constants/Colors";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getColorsCategories } from "../../db/queries/categories";

type Props = {
  data: { x: string; y: number }[];
  currency: string;
};

export function ExpensePie({ data, currency }: Props) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const total = data.reduce((sum, item) => sum + item.y, 0);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {},
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const rows = await getColorsCategories();

        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.name] = r.color;
        });

        setCategoryColors(map);
      })();
    }, []),
  );

  const colorScale = data.map(
    (item) => categoryColors[item.x] ?? "#CBD5E1", // color por defecto
  );

  return (
    <View
      style={{
        backgroundColor: Colors[theme].card,
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 16,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: Colors[theme].text,
          marginBottom: 8,
        }}
      >
        Gastos por categoría
      </Text>

      <VictoryPie
        data={data}
        width={screenWidth - 32}
        height={260}
        innerRadius={0}
        padAngle={2}
        cornerRadius={6}
        labels={() => null}
        style={{
          data: {
            stroke: Colors[theme].card,
            strokeWidth: 2,
          },
        }}
        colorScale={colorScale}
      />

      {/* LEYENDA */}
      <View style={{ marginTop: 8 }}>
        {data.map((item, index) => {
          const percent = total > 0 ? Math.round((item.y / total) * 100) : 0;

          return (
            <View
              key={`${item.x}-${index}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginHorizontal: 8,
                width: "100%",
                borderBottomWidth: index === data.length - 1 ? 0 : 1,
                borderBottomColor: Colors[theme].textMuted + "30",
              }}
            >
             
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  marginRight: 8,
                }}
              >
                
                <View
                  style={{
                    width: 42,
                    height: 22,
                    borderRadius: 4,
                    backgroundColor: colorScale[index % colorScale.length],
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    {percent}%
                  </Text>
                </View>

                
                <Text
                  numberOfLines={1}
                  style={{
                    color: Colors[theme].text,
                    fontWeight: "500",
                    flexShrink: 1,
                  }}
                >
                  {item.x}
                </Text>
              </View>

              <Text
                style={{
                  color: Colors[theme].text,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {currency} {item.y.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
