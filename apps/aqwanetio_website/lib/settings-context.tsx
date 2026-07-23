"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Language = "en" | "fil";

interface SettingsContextValue {
  language: Language;
  notifications: boolean;
  setLanguage: (lang: Language) => void;
  toggleNotifications: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fil");
  const [notifications, setNotifications] = useState(false);

  const toggleNotifications = useCallback(() => {
    setNotifications((prev) => {
      const next = !prev;
      if (next && typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ language, notifications, setLanguage, toggleNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
