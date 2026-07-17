import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemeMode } from "@/lib/highcharts-theme";

interface ThemeState {
  theme: ThemeMode;
  colorblind: boolean;
  toggleTheme: () => void;
  toggleColorblind: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const THEME_KEY = "alugaflow-theme";
const CB_KEY = "alugaflow-colorblind";

// Aplica as escolhas no <html> (classe .dark e atributo data-colorblind).
function apply(theme: ThemeMode, colorblind: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.colorblind = colorblind ? "true" : "false";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [colorblind, setColorblind] = useState(false);

  // Lê as preferências salvas assim que monta no cliente.
  useEffect(() => {
    const savedTheme = (localStorage.getItem(THEME_KEY) as ThemeMode) ?? "light";
    const savedCb = localStorage.getItem(CB_KEY) === "true";
    setTheme(savedTheme);
    setColorblind(savedCb);
    apply(savedTheme, savedCb);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      apply(next, colorblind);
      return next;
    });
  }, [colorblind]);

  const toggleColorblind = useCallback(() => {
    setColorblind((prev) => {
      const next = !prev;
      localStorage.setItem(CB_KEY, String(next));
      apply(theme, next);
      return next;
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colorblind, toggleTheme, toggleColorblind }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
}
