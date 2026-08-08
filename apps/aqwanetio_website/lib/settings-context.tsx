"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Language = "en" | "fil";
type Theme = "dark" | "light";

interface SettingsContextValue {
  language: Language;
  notifications: boolean;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  toggleNotifications: () => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "aqw-theme";

function initialTheme(): Theme {
  if (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "light") {
    return "light";
  }
  return "dark";
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fil");
  const [notifications, setNotifications] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleNotifications = useCallback(() => {
    setNotifications((prev) => {
      const next = !prev;
      if (next && typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <SettingsContext.Provider
      value={{ language, notifications, theme, setLanguage, toggleNotifications, toggleTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}