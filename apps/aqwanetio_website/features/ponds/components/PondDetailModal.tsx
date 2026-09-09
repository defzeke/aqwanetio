"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pondsService } from "../services";
import { readingsService } from "@/features/readings/services";
import { predictionsService } from "@/features/predictions/services";
import PondChart, { type ChartMetric } from "./PondChart";
import StationComparisonBar from "./StationComparisonBar";
import PondHealthRadar from "./PondHealthRadar";
import { useTranslation } from "@/lib/translations";

const DAY_MS = 86_400_000;

function toDateTimeLocal(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PondDetailModal({
  pondId,
  onClose,
}: {
  pondId: string;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const pond = pondsService.getById(pondId);

  const [view, setView] = useState<"live" | "history">("live");
  const [nowMs] = useState(() => Date.now());
  const [endTime, setEndTime] = useState(() => toDateTimeLocal(nowMs - DAY_MS));
  const [metric, setMetric] = useState<ChartMetric>("ammonia");
  const [barMetric, setBarMetric] = useState<ChartMetric>("209");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const endTs = useMemo(() => {
    const raw = new Date(endTime).getTime();
    return Number.isFinite(raw) ? Math.min(raw, nowMs) : nowMs;
  }, [endTime, nowMs]);

  const readings = useMemo(
    () =>
      view === "live"
        ? readingsService.getByPond(pondId, 12)
        : readingsService.getByPondAt(pondId, endTs, 12),
    [view, pondId, endTs],
  );

  const predictions = useMemo(
    () =>
      view === "live"
        ? predictionsService.getPrediction(pondId)
        : predictionsService.getPredictionAt(pondId, endTs),
    [view, pondId, endTs],
  );

  if (!pond) return null;

  const statusStyles: Record<string, string> = {
    safe: "bg-safe/10 text-safe border-safe/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    toxic: "bg-alert/10 text-alert border-alert/20",
  };

  const toggleBtn = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
      active ? "bg-cyan text-[#02131c]" : "text-muted hover:text-ink"
    }`;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-2xl animate-[modal-in_0.18s_ease-out] rounded-[1.25rem] bg-gradient-to-br from-cyan/35 via-line to-gold/35 p-px shadow-[var(--shadow-panel)]">
        <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-[calc(1.25rem-1px)] bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <h2 className="truncate text-xl font-semibold text-ink">{pond.name}</h2>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                  statusStyles[pond.status]
                }`}
              >
                NH₃: {pond.ammoniaLevel} ppm
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink"
              aria-label={t("modal.close")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label={t("modal.dataView")}
                className="flex rounded-full border border-line bg-surface p-1 shadow-[var(--shadow-raise-sm)]"
              >
                <button
                  type="button"
                  onClick={() => setView("live")}
                  className={toggleBtn(view === "live")}
                >
                  {t("modal.live")}
                </button>
                <button
                  type="button"
                  onClick={() => setView("history")}
                  className={toggleBtn(view === "history")}
                >
                  {t("modal.historicalData")}
                </button>
              </div>

              {view === "history" && (
                <label className="flex items-center gap-2 text-sm font-medium text-muted">
                  <span>{t("modal.dateTime")}</span>
                  <input
                    type="datetime-local"
                    value={endTime}
                    min={toDateTimeLocal(nowMs - 30 * DAY_MS)}
                    max={toDateTimeLocal(nowMs)}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="neu-input h-10 rounded-xl px-3 text-sm"
                  />
                </label>
              )}
            </div>

            {/* Metric selector */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <label className="text-sm font-medium text-muted" htmlFor="metric-select">{t("modal.metricLabel")}</label>
              <select
                id="metric-select"
                value={metric}
                onChange={(e) => setMetric(e.target.value as ChartMetric)}
                className="neu-input h-9 rounded-xl px-3 text-sm"
              >
                <option value="ammonia">{t("modal.ammonia")}</option>
                <option value="210">{t("metrics.p210")} ({t("metrics.unit210")})</option>
                <option value="218">{t("metrics.p218")} ({t("metrics.unit218")})</option>
                <option value="176">{t("metrics.p176")} ({t("metrics.unit176")})</option>
                <option value="177">{t("metrics.p177")} ({t("metrics.unit177")})</option>
                <option value="209">{t("metrics.p209")} ({t("metrics.unit209")})</option>
                <option value="217">{t("metrics.p217")} ({t("metrics.unit217")})</option>
                <option value="170">{t("metrics.p170")} ({t("metrics.unit170")})</option>
                <option value="173">{t("metrics.p173")} ({t("metrics.unit173")})</option>
              </select>
            </div>

            <h4 className="mb-2 text-sm font-semibold text-ink">{t("charts.lineTitle")}</h4>
            <PondChart readings={readings} predictions={metric === "ammonia" ? predictions : undefined} metric={metric} />

            <div className="mt-6 mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">{t("charts.barTitle")}</h4>
              <select value={barMetric} onChange={(e) => setBarMetric(e.target.value as ChartMetric)} className="neu-input h-8 rounded-lg px-2 text-xs">
                <option value="209">{t("metrics.p209")}</option>
                <option value="210">{t("metrics.p210")}</option>
                <option value="176">{t("metrics.p176")}</option>
                <option value="170">{t("metrics.p170")}</option>
              </select>
            </div>
            <StationComparisonBar metric={barMetric} />

            <div className="mt-6">
              <PondHealthRadar pondId={pondId} />
            </div>
          </div>

          <div className="flex justify-end border-t border-line px-6 py-4">
            <button
              onClick={onClose}
              className="btn btn-ghost rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              {t("modal.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}