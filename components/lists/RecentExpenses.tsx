import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTheme } from "../../app/context/ThemeContext";
type Expense = {
  id: number;
  title: string;
  category: string;
  amount: number;
};

type Props = {
  items: Expense[];
  currency: string;
};
const MAX_LENGTH = 25;

export function RecentExpenses({ items, currency }: Props) {
  const { theme } = useTheme(); 

  return (
    <View
      style={{
        backgroundColor: Colors[theme].card,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 12,
          color: Colors[theme].text,
        }}
      >
        Últimos gastos
      </Text>

      {items.map((item, index) => (
        <View
          key={item.id}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            borderBottomWidth: index === items.length - 1 ? 0 : 1,
            borderBottomColor: Colors[theme].textMuted + "30",
          }}
        >
          <View>
            <Text style={{ color: Colors[theme].text }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title.length > MAX_LENGTH
              ? item.title.substring(0, MAX_LENGTH) + "..."
              : item.title}
            </Text>
            <Text style={{ color: Colors[theme].textMuted, fontSize: 12 }}>
              {item.category}
            </Text>
          </View>

          <Text
            style={{
              fontWeight: '600',
              color: Colors[theme].danger,
            }}
          >
            {currency} {item.amount.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
}
