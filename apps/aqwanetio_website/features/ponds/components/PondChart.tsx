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

const metrics: { key: MetricKey; label: string }[] = [
  { key: "ammonia",         label: "NH₃ (ppm)" },
  { key: "temperature",     label: "Temp (°C)" },
  { key: "ph",              label: "pH" },
  { key: "dissolvedOxygen", label: "DO (mg/L)" },
];

const warnings: Record<MetricKey, { danger: number; label: string }> = {
  ammonia:         { danger: 1.0, label: "Critical 1.0" },
  temperature:     { danger: 33,  label: "Critical 33°C" },
  ph:              { danger: 5.5, label: "Low 5.5" },
  dissolvedOxygen: { danger: 3,   label: "Low 3 mg/L" },
};

const unitOf: Record<MetricKey, string> = {
  ammonia: "ppm", temperature: "°C", ph: "", dissolvedOxygen: "mg/L",
};

const W   = 560;
const H   = 220;
const PAD = { top: 16, right: 12, bottom: 36, left: 44 };
const iW  = W - PAD.left - PAD.right;
const iH  = H - PAD.top  - PAD.bottom;

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

interface TooltipData {
  x: number;
  y: number;
  label: string;  
  value: string;   
  isForecast: boolean;
}

function SvgTooltip({ d }: { d: TooltipData }) {
  const TW = 108;
  const TH = 38;
  const MARGIN = 8;
  const tx = d.x + TW + MARGIN > W - PAD.right ? d.x - TW - MARGIN : d.x + MARGIN;
  const ty = Math.max(PAD.top, Math.min(d.y - TH / 2, PAD.top + iH - TH));

  return (
    <g pointerEvents="none">
      <line
        x1={d.x} y1={PAD.top} x2={d.x} y2={PAD.top + iH}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2"
      />
      <circle cx={d.x} cy={d.y} r={6}
        fill={d.isForecast ? "#f97316" : "#22c55e"} fillOpacity={0.2}
        stroke={d.isForecast ? "#f97316" : "#22c55e"} strokeWidth={1.5}
      />
      <circle cx={d.x} cy={d.y} r={3}
        fill={d.isForecast ? "#f97316" : "#22c55e"}
      />
      <rect
        x={tx} y={ty} width={TW} height={TH} rx={5}
        fill="white" stroke="#e2e8f0" strokeWidth={1}
        filter="drop-shadow(0 1px 3px rgba(0,0,0,.12))"
      />
      <text x={tx + 8} y={ty + 13} fontSize={9} fill="#6b7280">
        {d.label}{d.isForecast ? " (forecast)" : ""}
      </text>
      <text x={tx + 8} y={ty + 27} fontSize={12} fontWeight="600" fill="#1e293b">
        {d.value}
      </text>
    </g>
  );
}

export default function PondChart({ readings, predictions }: Props) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<MetricKey>("ammonia");

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const history = useMemo(() => [...readings].reverse(), [readings]);

  const vals = useMemo(
    () => history.map((r) => r[metric] as number),
    [history, metric],
  );

  const forecastVals = useMemo(
    () => metric === "ammonia" && predictions
      ? predictions.map((p) => p.predictedAmmonia)
      : [],
    [metric, predictions],
  );

  const allVals = [
    ...vals,
    ...forecastVals,
    ...(predictions && metric === "ammonia"
      ? predictions.flatMap((p) => [p.upperBound, p.lowerBound])
      : []),
  ];

  const minV = Math.min(...allVals) * 0.92;
  const maxV = Math.max(...allVals) * 1.08;

  const warn      = warnings[metric];
  const currentVal = vals[vals.length - 1] ?? 0;
  const safe      = currentVal < warn.danger;
  const lineColor = safe ? "#22c55e" : "#ef4444";

  const total     = history.length + forecastVals.length;
  const domainMax = Math.max(total - 1, 1);

  const histPts: [number, number][] = history.map((_, i) => [
    scaleX(i, domainMax),
    scaleY(vals[i], minV, maxV),
  ]);

  const forecastPts: [number, number][] = forecastVals.map((v, i) => [
    scaleX(history.length + i, domainMax),
    scaleY(v, minV, maxV),
  ]);

  const upperPts: [number, number][] =
    predictions && metric === "ammonia"
      ? predictions.map((p, i) => [
          scaleX(history.length + i, domainMax),
          scaleY(p.upperBound, minV, maxV),
        ])
      : [];

  const lowerPts: [number, number][] =
    predictions && metric === "ammonia"
      ? predictions.map((p, i) => [
          scaleX(history.length + i, domainMax),
          scaleY(p.lowerBound, minV, maxV),
        ])
      : [];

  const allPts: [number, number][] = [...histPts, ...forecastPts];

  const allTs = [
    ...history.map((r) => r.timestamp),
    ...(predictions?.map((p) => p.timestamp) ?? []),
  ];

  const allValsFlat = [...vals, ...forecastVals];

  const separatorX =
    histPts.length > 0 && forecastPts.length > 0
      ? (histPts[histPts.length - 1][0] + forecastPts[0][0]) / 2
      : null;

  const bandPath =
    upperPts.length > 0
      ? `M ${upperPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} ` +
        `L ${[...lowerPts].reverse().map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} Z`
      : "";

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minV + (i / 4) * (maxV - minV);
    return { v, y: scaleY(v, minV, maxV) };
  });

  const xStep  = Math.max(1, Math.floor(total / 5));
  const xTicks = allTs
    .map((ts, i) => ({ i, ts }))
    .filter(({ i }) => i % xStep === 0 || i === allTs.length - 1);

  const dangerY   = scaleY(warn.danger, minV, maxV);
  const showDanger = dangerY >= PAD.top && dangerY <= PAD.top + iH;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const svg = svgRef.current;
      if (!svg || allPts.length === 0) return;

      const rect = svg.getBoundingClientRect();
      const scaleRatio = W / rect.width;            
      const mouseVbX   = (e.clientX - rect.left) * scaleRatio;

      let nearest = 0;
      let minDist = Infinity;
      for (let i = 0; i < allPts.length; i++) {
        const d = Math.abs(allPts[i][0] - mouseVbX);
        if (d < minDist) { minDist = d; nearest = i; }
      }
      setHoveredIdx(nearest);
    },
    [allPts],
  );

  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

  const tooltipData: TooltipData | null = useMemo(() => {
    if (hoveredIdx === null || hoveredIdx >= allPts.length) return null;
    const [x, y] = allPts[hoveredIdx];
    const v      = allValsFlat[hoveredIdx] ?? 0;
    const ts     = allTs[hoveredIdx] ?? "";
    const isForecast = hoveredIdx >= history.length;
    return {
      x, y,
      label: fmtTime(ts),
      value: `${v.toFixed(3)} ${unitOf[metric]}`.trim(),
      isForecast,
    };
  }, [hoveredIdx, metric]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text">{t("modal.metricLabel")}</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricKey)}
          className="rounded border border-border bg-white px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-navy/30"
        >
          {metrics.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-border bg-white p-3 overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${metric} chart`}
          style={{ display: "block" }}
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

          {bandPath && (
            <path d={bandPath} fill="#fecaca" fillOpacity={0.45} stroke="none" />
          )}

          {separatorX !== null && (
            <line
              x1={separatorX} y1={PAD.top}
              x2={separatorX} y2={PAD.top + iH}
              stroke="#d1d5db" strokeWidth={1} strokeDasharray="4 3"
            />
          )}

          {histPts.length > 1 && (
            <polyline
              points={polyline(histPts)}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {histPts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} fill={lineColor} />
          ))}

          {forecastPts.length > 0 && histPts.length > 0 && (
            <polyline
              points={polyline([histPts[histPts.length - 1], ...forecastPts])}
              fill="none"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="6 3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {yTicks.map(({ v, y }, i) => (
            <text key={i} x={PAD.left - 6} y={y + 4}
              fontSize={10} fill="#6b7280" textAnchor="end">
              {v.toFixed(2)}
            </text>
          ))}

          {xTicks.map(({ i, ts }) => (
            <text key={i} x={scaleX(i, domainMax)} y={PAD.top + iH + 14}
              fontSize={10} fill="#6b7280" textAnchor="middle">
              {fmtTime(ts)}
            </text>
          ))}

          {forecastPts.length > 0 && (
            <g transform={`translate(${PAD.left + 4}, ${PAD.top + 4})`} pointerEvents="none">
              <line x1={0} y1={6} x2={18} y2={6} stroke={lineColor} strokeWidth={2} />
              <circle cx={9} cy={6} r={3} fill={lineColor} />
              <text x={22} y={10} fontSize={10} fill="#374151">Historical</text>
              <line x1={0} y1={22} x2={18} y2={22} stroke="#f97316" strokeWidth={2} strokeDasharray="6 3" />
              <text x={22} y={26} fontSize={10} fill="#374151">Forecast</text>
            </g>
          )}

          <rect
            x={PAD.left} y={PAD.top}
            width={iW} height={iH}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "crosshair" }}
          />

          {tooltipData && <SvgTooltip d={tooltipData} />}
        </svg>
      </div>
      
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
          safe
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-red-200 bg-red-50 text-red-800"
        }`}
      >
        <span className="text-sm font-medium">{t("modal.current")}:</span>
        <span className="text-lg font-bold">
          {currentVal.toFixed(2)} {unitOf[metric]}
        </span>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${
            safe ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {safe ? "Safe" : "Critical"}
        </span>
      </div>
    </div>
  );
}
