"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translations";

export default function MapLegend() {
  const { t } = useTranslation();
  const [time, setTime] = useState<Date | null>(() => new Date());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="neu-card pointer-events-auto w-[280px] max-w-[calc(100vw-2.5rem)] overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-3 pb-2 md:p-4 md:pb-2">
        <h2 className="text-base font-bold text-cyan">{t("mapLegend.title")}</h2>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? t("ui.expand") : t("ui.collapse")}
          className="btn btn-ghost h-7 w-7 shrink-0 rounded-full p-0"
        >
          <svg
            className={`h-4 w-4 text-muted transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-2.5 p-3 pt-1 md:p-4 md:pt-1">
          <div className="flex items-start gap-2.5">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#15803d]" />
            <span className="text-sm text-muted">
              <strong className="text-ink">{t("mapLegend.safeLabel")}</strong>{" "}
              {t("mapLegend.safeDesc")}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#d97706]" />
            <span className="text-sm text-muted">
              <strong className="text-ink">{t("mapLegend.warningLabel")}</strong>{" "}
              {t("mapLegend.warningDesc")}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#dc2626]" />
            <span className="text-sm text-muted">
              <strong className="text-ink">{t("mapLegend.toxicLabel")}</strong>{" "}
              {t("mapLegend.toxicDesc")}
            </span>
          </div>

          <div className="my-3 border-t border-line" />

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <div>
                <div className="text-sm font-bold text-ink">32°C</div>
                <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">Partly Cloudy</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-ink">
                {time ? time.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </div>
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                {time ? time.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}