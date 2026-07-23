"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type { Reading } from "@/features/readings/services/readings.service";
import type { Prediction } from "@/features/predictions/services/predictions.service";
import { useTranslation } from "@/lib/translations";

interface Props {
  readings: Reading[];
  predictions?: Prediction[];
}

type MetricKey = "ammonia" | "temperature" | "ph" | "dissolvedOxygen";

const metrics: { key: MetricKey; label: string; shortLabel: string; color: string }[] = [
  { key: "ammonia", label: "NH₃ (ppm)", shortLabel: "NH₃", color: "#22c55e" },
  { key: "temperature", label: "Temp (°C)", shortLabel: "Temp", color: "#3b82f6" },
  { key: "ph", label: "pH", shortLabel: "pH", color: "#a855f7" },
  { key: "dissolvedOxygen", label: "DO (mg/L)", shortLabel: "DO", color: "#f59e0b" },
];

const warnings: Record<MetricKey, { danger: number; label: string }> = {
  ammonia: { danger: 1.0, label: "Critical 1.0" },
  temperature: { danger: 33, label: "Critical 33°C" },
  ph: { danger: 5.5, label: "Low 5.5" },
  dissolvedOxygen: { danger: 3, label: "Low 3 mg/L" },
};

const unitOf: Record<MetricKey, string> = {
  ammonia: "ppm", temperature: "°C", ph: "", dissolvedOxygen: "mg/L",
};

const W = 560;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 36, left: 44 };
const iW = W - PAD.left - PAD.right;
const iH = H - PAD.top - PAD.bottom;

function scaleX(i: number, domainMax: number) {
  return PAD.left + (i / Math.max(domainMax, 1)) * iW;
}

function scaleY(v: number, min: number, max: number) {
  const range = max - min || 1;
  return PAD.top + iH - ((v - min) / range) * iH;
}

function polyline(pts: [number, number][]) {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function fmtTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface MultiTooltipData {
  x: number;
  ts: string;
  items: { shortLabel: string; value: string; color: string; isForecast: boolean }[];
}

function SvgMultiTooltip({ d }: { d: MultiTooltipData }) {
  const TW = 136;
  const rowH = 15;
  const headerH = 14;
  const padding = 7;
  const TH = headerH + d.items.length * rowH + padding * 2;
  const MARGIN = 8;
  const tx = d.x + TW + MARGIN > W - PAD.right ? d.x - TW - MARGIN : d.x + MARGIN;
  const ty = Math.max(PAD.top, Math.min(PAD.top + iH / 2 - TH / 2, PAD.top + iH - TH));

  return (
    <g pointerEvents="none">
      <line
        x1={d.x} y1={PAD.top} x2={d.x} y2={PAD.top + iH}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2"
      />
      <rect
        x={tx} y={ty} width={TW} height={TH} rx={5}
        fill="white" stroke="#e2e8f0" strokeWidth={1}
        filter="drop-shadow(0 1px 3px rgba(0,0,0,.14))"
      />
      <text x={tx + padding} y={ty + padding + 8} fontSize={9} fill="#6b7280" fontWeight="500">
        {d.ts}
      </text>
      {d.items.map((item, i) => (
        <g key={i}>
          <circle
            cx={tx + padding + 5}
            cy={ty + padding + headerH + i * rowH + 5}
            r={3.5}
            fill={item.color}
          />
          <text
            x={tx + padding + 13}
            y={ty + padding + headerH + i * rowH + 9}
            fontSize={10}
            fontWeight="600"
            fill="#1e293b"
          >
            {item.value}{item.isForecast ? " ⋯" : ""}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function PondChart({ readings, predictions }: Props) {
  const { t } = useTranslation();

  // Multi-metric checklist: starts with ammonia selected
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(
    new Set<MetricKey>(["ammonia"])
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const history = useMemo(() => [...readings].reverse(), [readings]);

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // keep at least one active
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectedList = metrics.filter((m) => selectedMetrics.has(m.key));

  // Shared y-domain across ALL selected metrics + forecast
  const allDataVals = useMemo(() => {
    const vals: number[] = [];
    for (const m of selectedList) {
      history.forEach((r) => vals.push(r[m.key] as number));
      if (m.key === "ammonia" && predictions) {
        predictions.forEach((p) => {
          vals.push(p.predictedAmmonia, p.upperBound, p.lowerBound);
        });
      }
    }
    return vals;
  }, [selectedList, history, predictions]);

  const minV = allDataVals.length > 0 ? Math.min(...allDataVals) * 0.92 : 0;
  const maxV = allDataVals.length > 0 ? Math.max(...allDataVals) * 1.08 : 1;

  // Forecast only for ammonia
  const forecastVals = useMemo(
    () =>
      selectedMetrics.has("ammonia") && predictions
        ? predictions.map((p) => p.predictedAmmonia)
        : [],
    [selectedMetrics, predictions],
  );

  const total = history.length + forecastVals.length;
  const domainMax = Math.max(total - 1, 1);

  // Historical point sets per selected metric
  const histPtsMap = useMemo(() => {
    const map = new Map<MetricKey, [number, number][]>();
    for (const m of selectedList) {
      map.set(
        m.key,
        history.map((r, i) => [scaleX(i, domainMax), scaleY(r[m.key] as number, minV, maxV)])
      );
    }
    return map;
  }, [selectedList, history, domainMax, minV, maxV]);

  const forecastPts: [number, number][] = forecastVals.map((v, i) => [
    scaleX(history.length + i, domainMax),
    scaleY(v, minV, maxV),
  ]);

  const upperPts: [number, number][] =
    predictions && selectedMetrics.has("ammonia")
      ? predictions.map((p, i) => [
        scaleX(history.length + i, domainMax),
        scaleY(p.upperBound, minV, maxV),
      ])
      : [];

  const lowerPts: [number, number][] =
    predictions && selectedMetrics.has("ammonia")
      ? predictions.map((p, i) => [
        scaleX(history.length + i, domainMax),
        scaleY(p.lowerBound, minV, maxV),
      ])
      : [];

  const ammoniaHistPts = histPtsMap.get("ammonia") ?? [];
  const separatorX =
    ammoniaHistPts.length > 0 && forecastPts.length > 0
      ? (ammoniaHistPts[ammoniaHistPts.length - 1][0] + forecastPts[0][0]) / 2
      : null;

  const bandPath =
    upperPts.length > 0
      ? `M ${upperPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} ` +
      `L ${[...lowerPts].reverse().map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} Z`
      : "";

  const allTs = [
    ...history.map((r) => r.timestamp),
    ...(predictions?.map((p) => p.timestamp) ?? []),
  ];

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minV + (i / 4) * (maxV - minV);
    return { v, y: scaleY(v, minV, maxV) };
  });

  const xStep = Math.max(1, Math.floor(total / 5));
  const xTicks = allTs
    .map((ts, i) => ({ i, ts }))
    .filter(({ i }) => i % xStep === 0 || i === allTs.length - 1);

  // Danger line: use first selected metric
  const refMetric = selectedList[0];
  const warn = warnings[refMetric?.key ?? "ammonia"];
  const dangerY = scaleY(warn.danger, minV, maxV);
  const showDanger = dangerY >= PAD.top && dangerY <= PAD.top + iH;

  // Mouse targeting uses the first selected metric's points
  const refHistPts = histPtsMap.get(refMetric?.key ?? "ammonia") ?? [];
  const allPtsRef: [number, number][] = [
    ...refHistPts,
    ...(refMetric?.key === "ammonia" ? forecastPts : []),
  ];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const svg = svgRef.current;
      if (!svg || allPtsRef.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const scaleRatio = W / rect.width;
      const mouseVbX = (e.clientX - rect.left) * scaleRatio;
      let nearest = 0;
      let minDist = Infinity;
      for (let i = 0; i < allPtsRef.length; i++) {
        const d = Math.abs(allPtsRef[i][0] - mouseVbX);
        if (d < minDist) { minDist = d; nearest = i; }
      }
      setHoveredIdx(nearest);
    },
    [allPtsRef],
  );

  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const tooltipData: MultiTooltipData | null = useMemo(() => {
    if (hoveredIdx === null || allPtsRef.length === 0 || hoveredIdx >= allPtsRef.length) return null;
    const [x] = allPtsRef[hoveredIdx];
    const ts = allTs[hoveredIdx] ?? "";
    const isForecast = hoveredIdx >= history.length;

    const items = selectedList.flatMap((m) => {
      let val: number;
      if (isForecast) {
        if (m.key === "ammonia" && predictions) {
          val = predictions[hoveredIdx - history.length]?.predictedAmmonia ?? 0;
        } else {
          return []; // non-ammonia metrics have no forecast
        }
      } else {
        val = history[hoveredIdx]?.[m.key] as number ?? 0;
      }
      const vStr = unitOf[m.key] ? `${val.toFixed(2)} ${unitOf[m.key]}` : val.toFixed(2);
      return [{
        shortLabel: m.shortLabel,
        value: `${m.shortLabel}: ${vStr}`,
        color: m.color,
        isForecast,
      }];
    });

    return { x, ts: fmtTime(ts), items };
  }, [hoveredIdx, allPtsRef, allTs, history, selectedList, predictions]);

  // Current-value tiles per selected metric
  const currentVals = selectedList.map((m) => {
    const val = (history[history.length - 1]?.[m.key] as number) ?? 0;
    const safe = val < warnings[m.key].danger;
    return { ...m, val, safe };
  });

  const cols = Math.min(currentVals.length, 2);

  return (
    <div className="space-y-4">
      {/* Metric checklist pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-text shrink-0">{t("modal.metricLabel")}</span>
        <div className="flex flex-wrap gap-1.5">
          {metrics.map((m) => {
            const active = selectedMetrics.has(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 select-none ${active
                    ? "border-transparent text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  }`}
                style={active ? { backgroundColor: m.color, borderColor: m.color } : {}}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.75)" : m.color }}
                />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-white p-3 overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="multi-metric chart"
          style={{ display: "block", minWidth: `${W}px`, width: "100%" }}
        >
          {/* Grid lines */}
          {yTicks.map(({ y }, i) => (
            <line key={i} x1={PAD.left} y1={y} x2={PAD.left + iW} y2={y}
              stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
          ))}

          {showDanger && (
            <>
              <line x1={PAD.left} y1={dangerY} x2={PAD.left + iW} y2={dangerY}
                stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={PAD.left + iW - 4} y={dangerY - 4}
                fontSize={10} fill="#ef4444" textAnchor="end">
                {warn.label}
              </text>
            </>
          )}

          {/* Confidence band (ammonia forecast) */}
          {bandPath && (
            <path d={bandPath} fill="#fecaca" fillOpacity={0.4} stroke="none" />
          )}

          {separatorX !== null && (
            <line
              x1={separatorX} y1={PAD.top}
              x2={separatorX} y2={PAD.top + iH}
              stroke="#d1d5db" strokeWidth={1} strokeDasharray="4 3"
            />
          )}

          {/* Lines per metric */}
          {selectedList.map((m) => {
            const hPts = histPtsMap.get(m.key) ?? [];
            const fPts = m.key === "ammonia" ? forecastPts : [];
            const connected: [number, number][] =
              hPts.length > 0 && fPts.length > 0
                ? [hPts[hPts.length - 1], ...fPts]
                : fPts;

            return (
              <g key={m.key}>
                {hPts.length > 1 && (
                  <polyline
                    points={polyline(hPts)}
                    fill="none"
                    stroke={m.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {hPts.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={3} fill={m.color} />
                ))}
                {connected.length > 1 && (
                  <polyline
                    points={polyline(connected)}
                    fill="none"
                    stroke={m.color}
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity={0.7}
                  />
                )}
              </g>
            );
          })}

          {/* Y-axis labels */}
          {yTicks.map(({ v, y }, i) => (
            <text key={i} x={PAD.left - 6} y={y + 4}
              fontSize={10} fill="#6b7280" textAnchor="end">
              {v.toFixed(2)}
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map(({ i, ts }) => (
            <text key={i} x={scaleX(i, domainMax)} y={PAD.top + iH + 14}
              fontSize={10} fill="#6b7280" textAnchor="middle">
              {fmtTime(ts)}
            </text>
          ))}

          {/* Legend */}
          <g transform={`translate(${PAD.left + 4}, ${PAD.top + 4})`} pointerEvents="none">
            {selectedList.map((m, i) => (
              <g key={m.key} transform={`translate(0, ${i * 16})`}>
                <line x1={0} y1={6} x2={18} y2={6} stroke={m.color} strokeWidth={2} />
                <circle cx={9} cy={6} r={3} fill={m.color} />
                <text x={22} y={10} fontSize={10} fill="#374151">{m.shortLabel}</text>
              </g>
            ))}
            {forecastPts.length > 0 && selectedMetrics.has("ammonia") && (
              <g transform={`translate(0, ${selectedList.length * 16})`}>
                <line x1={0} y1={6} x2={18} y2={6}
                  stroke={metrics.find((m) => m.key === "ammonia")!.color}
                  strokeWidth={2} strokeDasharray="6 3" opacity={0.7}
                />
                <text x={22} y={10} fontSize={10} fill="#374151">Forecast</text>
              </g>
            )}
          </g>

          {/* Mouse capture overlay */}
          <rect
            x={PAD.left} y={PAD.top}
            width={iW} height={iH}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          />

          {tooltipData && <SvgMultiTooltip d={tooltipData} />}
        </svg>
      </div>

      {/* Current value tiles — one per active metric */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {currentVals.map((m) => (
          <div
            key={m.key}
            className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: m.safe ? "#bbf7d0" : "#fecaca",
              backgroundColor: m.safe ? "#f0fdf4" : "#fef2f2",
            }}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: m.color }}
            />
            <span className="text-xs font-medium shrink-0" style={{ color: m.safe ? "#166534" : "#991b1b" }}>
              {m.shortLabel}:
            </span>
            <span className="text-sm font-bold" style={{ color: m.safe ? "#15803d" : "#dc2626" }}>
              {m.val.toFixed(2)}{unitOf[m.key] ? ` ${unitOf[m.key]}` : ""}
            </span>
            <span
              className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: m.safe ? "#bbf7d0" : "#fecaca",
                color: m.safe ? "#166534" : "#991b1b",
              }}
            >
              {m.safe ? "Safe" : "Critical"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
