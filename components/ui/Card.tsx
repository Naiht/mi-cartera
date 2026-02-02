import { View, ViewProps } from "react-native";
import { useColorScheme } from "../useColorScheme";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../app/context/ThemeContext";

export function Card({ style, ...props }: ViewProps) {
  const { theme } = useTheme();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: Colors[theme].card,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
        },
        style,
      ]}
    />
  );
}
