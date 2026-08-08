"use client";

import { useMemo, useRef, useCallback, useState } from "react";
import type { Reading } from "@/features/readings/services/readings.service";
import type { Prediction } from "@/features/predictions/services/predictions.service";

interface Props {
  readings: Reading[];
  predictions?: Prediction[];
}

const NH3_COLOR = "var(--color-cyan)";
const DANGER = 1.0; // ppm
const UNIT = "ppm";

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

interface TooltipData {
  x: number;
  ts: string;
  value: string;
  isForecast: boolean;
}

function SvgTooltip({ d }: { d: TooltipData }) {
  const TW = 110;
  const TH = 33;
  const padding = 7;
  const MARGIN = 8;
  const tx = d.x + TW + MARGIN > W - PAD.right ? d.x - TW - MARGIN : d.x + MARGIN;
  const ty = Math.max(PAD.top, PAD.top + iH / 2 - TH / 2);

  return (
    <g pointerEvents="none">
      <line
        x1={d.x} y1={PAD.top} x2={d.x} y2={PAD.top + iH}
        stroke="var(--color-line)" strokeWidth={1} strokeDasharray="3 2"
      />
      <rect
        x={tx} y={ty} width={TW} height={TH} rx={5}
        fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth={1}
        filter="drop-shadow(0 1px 3px rgba(0,0,0,.3))"
      />
      <text x={tx + padding} y={ty + padding + 8} fontSize={9} fill="var(--color-muted)" fontWeight="500">
        {d.ts}
      </text>
      <g>
        <circle cx={tx + padding + 5} cy={ty + padding + 17 + 5} r={3.5} fill={NH3_COLOR} />
        <text
          x={tx + padding + 13} y={ty + padding + 17 + 9}
          fontSize={10} fontWeight="600" fill="var(--color-ink)"
        >
          {d.value}{d.isForecast ? " ⋯" : ""}
        </text>
      </g>
    </g>
  );
}

export default function PondChart({ readings, predictions }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const history = useMemo(() => [...readings].reverse(), [readings]);

  const allVals = useMemo(() => {
    const vals = history.map((r) => r.ammonia);
    if (predictions) {
      predictions.forEach((p) => vals.push(p.predictedAmmonia, p.upperBound, p.lowerBound));
    }
    return vals;
  }, [history, predictions]);

  const minV = allVals.length > 0 ? Math.min(...allVals) * 0.92 : 0;
  const maxV = allVals.length > 0 ? Math.max(...allVals) * 1.08 : 1;

  const forecastVals = useMemo(
    () => predictions?.map((p) => p.predictedAmmonia) ?? [],
    [predictions],
  );
  const total = history.length + forecastVals.length;
  const domainMax = Math.max(total - 1, 1);

  const histPts: [number, number][] = useMemo(
    () => history.map((r, i) => [scaleX(i, domainMax), scaleY(r.ammonia, minV, maxV)]),
    [history, domainMax, minV, maxV],
  );

  const forecastPts: [number, number][] = useMemo(
    () => forecastVals.map((v, i) => [
      scaleX(history.length + i, domainMax),
      scaleY(v, minV, maxV),
    ]),
    [forecastVals, history.length, domainMax, minV, maxV],
  );

  const upperPts: [number, number][] =
    predictions?.map((p, i) => [
      scaleX(history.length + i, domainMax),
      scaleY(p.upperBound, minV, maxV),
    ]) ?? [];

  const lowerPts: [number, number][] =
    predictions?.map((p, i) => [
      scaleX(history.length + i, domainMax),
      scaleY(p.lowerBound, minV, maxV),
    ]) ?? [];

  const separatorX =
    histPts.length > 0 && forecastPts.length > 0
      ? (histPts[histPts.length - 1][0] + forecastPts[0][0]) / 2
      : null;

  const bandPath =
    upperPts.length > 0
      ? `M ${upperPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} ` +
      `L ${[...lowerPts].reverse().map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")} Z`
      : "";

  const allTs = useMemo(
    () => [
      ...history.map((r) => r.timestamp),
      ...(predictions?.map((p) => p.timestamp) ?? []),
    ],
    [history, predictions],
  );

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minV + (i / 4) * (maxV - minV);
    return { v, y: scaleY(v, minV, maxV) };
  });

  const xStep = Math.max(1, Math.floor(total / 5));
  const xTicks = allTs
    .map((ts, i) => ({ i, ts }))
    .filter(({ i }) => i % xStep === 0 || i === allTs.length - 1);

  const dangerY = scaleY(DANGER, minV, maxV);
  const showDanger = dangerY >= PAD.top && dangerY <= PAD.top + iH;

  const allPtsRef: [number, number][] = useMemo(
    () => [...histPts, ...forecastPts],
    [histPts, forecastPts],
  );

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

  const tooltipData: TooltipData | null = useMemo(() => {
    if (hoveredIdx === null || allPtsRef.length === 0 || hoveredIdx >= allPtsRef.length) return null;
    const [x] = allPtsRef[hoveredIdx];
    const isForecast = hoveredIdx >= history.length;
    const val = isForecast
      ? (predictions?.[hoveredIdx - history.length]?.predictedAmmonia ?? 0)
      : (history[hoveredIdx]?.ammonia ?? 0);
    return { x, ts: fmtTime(allTs[hoveredIdx] ?? ""), value: `NH₃: ${val.toFixed(2)} ${UNIT}`, isForecast };
  }, [hoveredIdx, allPtsRef, allTs, history, predictions]);

  const currentVal = history[history.length - 1]?.ammonia ?? 0;
  const safe = currentVal < DANGER;

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="neu-surface-sm p-3 overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="ammonia chart"
          style={{ display: "block", minWidth: `${W}px`, width: "100%" }}
        >
          {/* Grid lines */}
          {yTicks.map(({ y }, i) => (
            <line key={i} x1={PAD.left} y1={y} x2={PAD.left + iW} y2={y}
              stroke="var(--color-chart-grid)" strokeWidth={1} strokeDasharray="4 3" />
          ))}

          {showDanger && (
            <>
              <line x1={PAD.left} y1={dangerY} x2={PAD.left + iW} y2={dangerY}
                stroke="var(--color-alert)" strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={PAD.left + iW - 4} y={dangerY - 4}
                fontSize={10} fill="var(--color-alert)" textAnchor="end">
                Critical {DANGER} ppm
              </text>
            </>
          )}

          {/* Confidence band (ammonia forecast) */}
          {bandPath && (
            <path d={bandPath} fill="var(--color-band)" stroke="none" />
          )}

          {separatorX !== null && (
            <line
              x1={separatorX} y1={PAD.top}
              x2={separatorX} y2={PAD.top + iH}
              stroke="var(--color-line)" strokeWidth={1} strokeDasharray="4 3"
            />
          )}

          {/* Historical ammonia line */}
          {histPts.length > 1 && (
            <polyline
              points={polyline(histPts)}
              fill="none"
              stroke={NH3_COLOR}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {histPts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} fill={NH3_COLOR} />
          ))}

          {/* Forecast (dashed, bridged from last historical point) */}
          {histPts.length > 0 && forecastPts.length > 1 && (
            <polyline
              points={polyline([histPts[histPts.length - 1], ...forecastPts])}
              fill="none"
              stroke={NH3_COLOR}
              strokeWidth={2}
              strokeDasharray="6 3"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}

          {/* Y-axis labels */}
          {yTicks.map(({ v, y }, i) => (
            <text key={i} x={PAD.left - 6} y={y + 4}
              fontSize={10} fill="var(--color-muted)" textAnchor="end">
              {v.toFixed(2)}
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map(({ i, ts }) => (
            <text key={i} x={scaleX(i, domainMax)} y={PAD.top + iH + 14}
              fontSize={10} fill="var(--color-muted)" textAnchor="middle">
              {fmtTime(ts)}
            </text>
          ))}

          {/* Legend */}
          <g transform={`translate(${PAD.left + 4}, ${PAD.top + 4})`} pointerEvents="none">
            <line x1={0} y1={6} x2={18} y2={6} stroke={NH3_COLOR} strokeWidth={2} />
            <circle cx={9} cy={6} r={3} fill={NH3_COLOR} />
            <text x={22} y={10} fontSize={10} fill="var(--color-ink)">NH₃</text>
            {forecastPts.length > 0 && (
              <g transform="translate(0, 16)">
                <line x1={0} y1={6} x2={18} y2={6}
                  stroke={NH3_COLOR} strokeWidth={2} strokeDasharray="6 3" opacity={0.7} />
                <text x={22} y={10} fontSize={10} fill="var(--color-ink)">Forecast</text>
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

          {tooltipData && <SvgTooltip d={tooltipData} />}
        </svg>
      </div>

      {/* Current value tile */}
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
          safe ? "border-safe/30 bg-safe/10" : "border-alert/30 bg-alert/10"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${safe ? "bg-safe" : "bg-alert"}`}
        />
        <span className={`text-xs font-medium shrink-0 ${safe ? "text-safe" : "text-alert"}`}>
          NH₃:
        </span>
        <span className={`text-sm font-bold ${safe ? "text-safe" : "text-alert"}`}>
          {currentVal.toFixed(2)} {UNIT}
        </span>
        <span
          className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            safe ? "bg-safe/15 text-safe" : "bg-alert/15 text-alert"
          }`}
        >
          {safe ? "Safe" : "Critical"}
        </span>
      </div>
    </div>
  );
}
