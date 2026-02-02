import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from '../../constants/Colors';

const options = ['Semanal', 'Quincenal', 'Mensual'];

export function PeriodFilter() {
      const { theme } = useTheme(); 
  const [active, setActive] = useState('Mensual');

  return (
    <View style={styles.container}>
      {options.map(opt => {
        const isActive = opt === active;

        return (
          <Pressable
            key={opt}
            onPress={() => setActive(opt)}
            style={[
              styles.option,
              {
                backgroundColor: isActive
                  ? Colors[theme].primary
                  : Colors[theme].card,
              },
            ]}
          >
            <Text
              style={{
                color: isActive
                  ? '#fff'
                  : Colors[theme].textMuted,
                fontWeight: '600',
              }}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
