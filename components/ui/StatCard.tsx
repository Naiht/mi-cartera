import { Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '../useColorScheme';
import { Gradients } from '../../constants/Gradients';

type Props = {
  type: 'gasto' | 'ingreso';
  amount: number;
  currency: string;
  onPress?: () => void;
};

export function StatCard({ type, amount, currency, onPress }: Props) {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';

  const colors = Gradients[type][theme];
  const iconName = type === 'gasto' ? 'trending-down' : 'trending-up';
  const label = type === 'gasto' ? 'Gastos' : 'Ingresos';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
      style={({ pressed }) => [
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient colors={colors} style={styles.card}>
        <MaterialIcons
          name={iconName}
          size={130}
          color="rgba(255,255,255,0.18)"
          style={styles.backgroundIcon}
        />

        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>
          {currency} {amount.toLocaleString()}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  backgroundIcon: {
    position: 'absolute',
    right: -15,
    bottom: -25,
  },
  pressed: {
    opacity: 0.9,
  },
});
