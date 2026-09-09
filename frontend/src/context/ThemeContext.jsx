import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext } from "./themeContextObject";

const STORAGE_KEY = "au-helpdesk-theme";

function getSystemTheme() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }) {
  // preference is what the user picked: "light" | "dark" | "system"
  const [preference, setPreference] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem(STORAGE_KEY) || "light";
  });

  // Tracks the OS theme so "system" mode can follow it.
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // resolved is derived, not stored — no setState-in-effect needed.
  const resolved = preference === "system" ? systemTheme : preference;

  // Apply the resolved theme to the document + persist the preference.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved);
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [resolved, preference]);

  // Keep systemTheme in sync with the OS setting.
  useEffect(() => {
    if (!window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () =>
      setSystemTheme(media.matches ? "dark" : "light");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      preference,
      theme: resolved,
      setTheme: setPreference,
      toggleTheme: () =>
        setPreference(resolved === "dark" ? "light" : "dark"),
    }),
    [preference, resolved]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
