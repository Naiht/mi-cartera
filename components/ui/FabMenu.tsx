import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useColorScheme } from "../useColorScheme";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSingle: () => void;
  onList: () => void;
};

export function FabMenu({ onSingle, onList }: Props) {
  const theme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  /* ===== Animaciones ===== */
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(rotation, {
        toValue: open ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.spring(scale, {
        toValue: open ? 0.95 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(actionsAnim, {
        toValue: open ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // + → ×
  });

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
      )}

      <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
        {/* ACCIONES */}
        <Animated.View
          style={[
            styles.actions,
            {
              opacity: actionsAnim,
              transform: [
                {
                  translateY: actionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable
            onPress={() => {
              setOpen(false);
              onSingle();
            }}
            style={[
              styles.action,
              { backgroundColor: Colors[theme].secondary },
            ]}
          >
            <MaterialIcons name="receipt" size={20} color="#fff" />
            <Text style={styles.label}>Gasto único</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setOpen(false);
              onList();
            }}
            style={[
              styles.action,
              { backgroundColor: Colors[theme].secondary },
            ]}
          >
            <MaterialIcons name="list" size={20} color="#fff" />
            <Text style={styles.label}>Gastos en lista</Text>
          </Pressable>
        </Animated.View>

        {/* FAB */}
        <Animated.View
          style={{
            transform: [{ scale }],
          }}
        >
          <Pressable
            onPress={() => setOpen((v) => !v)}
            style={[styles.fab, { backgroundColor: Colors[theme].primary }]}
          >
            <Animated.View
              style={{
                transform: [{ rotate: rotateInterpolate }],
              }}
            >
              <MaterialIcons name="add" size={28} color="#fff" />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
}

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  container: {
    position: "absolute",
    right: 20,
    zIndex: 2,
    alignItems: "flex-end",
  },
  actions: {
    marginBottom: 12,
    alignItems: "flex-end",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    marginBottom: 8,
    elevation: 4,
  },
  label: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
});
