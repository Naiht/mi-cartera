import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from '../../constants/Colors';


type PeriodOption =
  | '7'
  | '15'
  | '30'
  | 'range';

type Props = {
  value: PeriodOption;
  onChange: (value: PeriodOption) => void;
};

export function PeriodSelect({ value, onChange }: Props) {
  const { theme } = useTheme(); 

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: Colors[theme].textMuted }]}>
        Período
      </Text>

      <View
        style={[
          styles.pickerWrapper,
          { backgroundColor: Colors[theme].card },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          dropdownIconColor={Colors[theme].text}
          style={{ color: Colors[theme].text }}
        >
          <Picker.Item label="Últimos 7 días" value="7" />
          <Picker.Item label="Últimos 15 días" value="15" />
          <Picker.Item label="Últimos 30 días" value="30" />
          <Picker.Item label="Rango de fechas" value="range" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  pickerWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
