"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translations";

export default function SettingsDropdown() {
  const { notifications, language, toggleNotifications, setLanguage } = useSettings();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100"
        aria-label="Settings"
        aria-expanded={open}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-600">{t("settings.title")}</h3>

          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t("settings.language")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "fil" : "en")}
                  className="rounded border border-gray-300 px-2 py-0.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  {language === "en" ? "EN" : "FIL"}
                </button>
              </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{t("settings.notifications")}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications}
                onClick={toggleNotifications}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  notifications ? "bg-navy" : "bg-gray-300"
                }`}
              >
                <span className={`inline-block h-4 w-4 translate-y-0 rounded-full bg-white shadow-sm transition-transform ${
                  notifications ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
