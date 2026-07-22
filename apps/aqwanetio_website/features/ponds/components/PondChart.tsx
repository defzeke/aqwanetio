"use client";

import { useState, useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import type { Reading } from "@/features/readings/services/readings.service";
import type { Prediction } from "@/features/predictions/services/predictions.service";
import { useTranslation } from "@/lib/translations";

interface Props {
  readings: Reading[];
  predictions?: Prediction[];
}

const metrics = [
  { key: "ammonia", unit: "NH₃ (ppm)" },
  { key: "temperature", unit: "Temp (°C)" },
  { key: "ph", unit: "pH" },
  { key: "dissolvedOxygen", unit: "DO (mg/L)" },
] as const;

const warnings: Record<string, { danger: number; ideal: string }> = {
  ammonia: { danger: 1.0, ideal: "< 1.0" },
  temperature: { danger: 33, ideal: "26 - 30" },
  ph: { danger: 5.5, ideal: "6.5 - 8.5" },
  dissolvedOxygen: { danger: 3, ideal: "> 5" },
};

export default function PondChart({ readings, predictions }: Props) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState("ammonia");

  const data = useMemo(() => {
    return readings
      .map((r) => ({
        time: new Date(r.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: r[metric as keyof Reading] as number,
      }))
      .reverse();
  }, [readings, metric]);

  const forecastData = useMemo(() => {
    if (metric !== "ammonia" || !predictions) return [];
    return predictions.map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      forecast: p.predictedAmmonia,
      upper: p.upperBound,
      lower: p.lowerBound,
    }));
  }, [predictions, metric]);

  const labelKey = `modal.${metric}`;
  const warn = warnings[metric];
  const currentVal = data.length > 0 ? data[data.length - 1].value : 0;
  const safe = warn ? currentVal < warn.danger : true;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text">{t("modal.metricLabel")}</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="rounded border border-border bg-white px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-navy/30"
        >
          {metrics.map((m) => (
            <option key={m.key} value={m.key}>
              {t("modal." + m.key)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-border bg-white p-4">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={metric === "ammonia" && forecastData.length ? [...data, ...forecastData] : data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />

            {warn && (
              <ReferenceLine
                y={warn.danger}
                stroke="#ef4444"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{
                  value: `Critical ${warn.danger}`,
                  position: "insideTopRight",
                  fill: "#ef4444",
                  fontSize: 11,
                }}
              />
            )}

            {metric === "ammonia" && forecastData.length > 0 && (
              <>
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="#fecaca"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="#fff"
                  fillOpacity={0}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  name="Forecast"
                />
              </>
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke={safe ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={{ r: 3, fill: safe ? "#22c55e" : "#ef4444" }}
              activeDot={{ r: 5 }}
              name={t(labelKey)}
            />
          </ComposedChart>
        </ResponsiveContainer>
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
          {currentVal.toFixed(2)} {t(labelKey).split(" ")[1]?.replace(/[()]/g, "")}
        </span>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${
            safe ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {safe ? t("mapLegend.safe").split(" ")[0] : t("mapLegend.critical").split(" ")[0]}
        </span>
      </div>
    </div>
  );
}
