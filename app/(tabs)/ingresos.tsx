import { ScrollView, View } from 'react-native';
import { Text } from '../../components/ui/Text';
import { useTheme } from "../context/ThemeContext";
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function Ingresos() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      edges={['top']} 
    >
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[theme].background, padding: 16 }}
    >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 32,
            }}
          >
            <MaterialIcons
              name="construction"
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
              Gestion de ingresos disponible en la version 1.2.1
            </Text>
          </View>
      
    </ScrollView></SafeAreaView>
  );
}