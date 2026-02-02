import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { getSettings, updateThemeMode } from "../../db/queries/settings";

type ThemeMode = "light" | "dark" | "system";

const ThemeContext = createContext<{
  theme: "light" | "dark";
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}>({
  theme: "light",
  mode: "system",
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = Appearance.getColorScheme() ?? "light";

  const [mode, setModeState] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      if (settings?.theme) {
        setModeState(settings.theme);
      }
    })();
  }, []);

  useEffect(() => {
    if (mode === "system") {
      setTheme(systemTheme);
    } else {
      setTheme(mode);
    }
  }, [mode, systemTheme]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await updateThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
