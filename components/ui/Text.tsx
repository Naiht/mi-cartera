import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from '../../constants/Colors';

export function Text(props: TextProps) {
    const { theme } = useTheme(); 

  return (
    <RNText
      {...props}
      style={[
        { color: Colors[theme].text },
        props.style,
      ]}
    />
  );
}
