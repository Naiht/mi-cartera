import { View, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTheme } from "../../app/context/ThemeContext";
import { Colors } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

type Props = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
};

export function BaseDatePicker({ label, value, onChange }: Props) {
  const { theme } = useTheme(); 
  const [open, setOpen] = useState(false);

    const formattedDate = formatDate(value);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }

    if (Platform.OS === 'android') {
      setOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: Colors[theme].textMuted }]}>
          {label}
        </Text>
      )}

      {/* Fake input */}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.input,
          { backgroundColor: Colors[theme].card },
        ]}
      >
        <Text style={{ color: Colors[theme].text }}>
          {formattedDate}
        </Text>
      </Pressable>

      {/* ANDROID */}
      {open && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      {/* IOS */}
      {Platform.OS === 'ios' && (
        <Modal visible={open} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: Colors[theme].card },
              ]}
            >
              <DateTimePicker
                value={value}
                mode="date"
                display="spinner"
                onChange={handleChange}
              />

              <Pressable
                onPress={() => setOpen(false)}
                style={styles.doneButton}
              >
                <Text
                  style={{
                    color: Colors[theme].primary,
                    fontWeight: '600',
                  }}
                >
                  Listo
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
  input: {
    borderRadius: 12,
    padding: 12,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
  },
  doneButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
