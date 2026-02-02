import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../constants/Colors';
import { useTheme } from "../../app/context/ThemeContext";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function BaseSelect({ label, value, options, onChange }: Props) {
  const { theme } = useTheme(); 

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: Colors[theme].textMuted }]}>
          {label}
        </Text>
      )}

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
          {options.map(opt => (
            <Picker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
            />
          ))}
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
