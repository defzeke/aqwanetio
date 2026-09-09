"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Reading, MetricId } from "@/features/readings/services/readings.service";
import type { Prediction } from "@/features/predictions/services/predictions.service";
import { useTranslation } from "@/lib/translations";

interface Props {
  readings: Reading[];
  predictions?: Prediction[];
  metric?: MetricId | "ammonia";
}

export type ChartMetric = MetricId | "ammonia";

const METRIC_CONFIG: Record<ChartMetric, { color: string; unit: string; labelKey: string }> = {
  ammonia: { color: "var(--color-cyan)", unit: "ppm", labelKey: "modal.ammonia" },
  "210": { color: "#0e7490", unit: "mg/L", labelKey: "metrics.p210" },
  "218": { color: "#0891b2", unit: "mg/L", labelKey: "metrics.p218" },
  "176": { color: "#2563eb", unit: "mg/L", labelKey: "metrics.p176" },
  "177": { color: "#38bdf8", unit: "%", labelKey: "metrics.p177" },
  "209": { color: "#9333ea", unit: "pH", labelKey: "metrics.p209" },
  "217": { color: "#7c3aed", unit: "mV", labelKey: "metrics.p217" },
  "170": { color: "#ea580c", unit: "°C", labelKey: "metrics.p170" },
  "173": { color: "#0d9488", unit: "PSU", labelKey: "metrics.p173" },
};

function getMetricValue(r: Reading, metric: ChartMetric): number {
  switch (metric) {
    case "210": return r.param210;
    case "218": return r.param218;
    case "176": return r.param176;
    case "177": return r.param177;
    case "209": return r.param209;
    case "217": return r.param217;
    case "170": return r.param170;
    case "173": return r.param173;
    default: return r.ammonia;
  }
}

export default function PondChart({ readings, predictions, metric = "ammonia" }: Props) {
  const { t } = useTranslation();
  const cfg = METRIC_CONFIG[metric];
  const label = t(cfg.labelKey);
  const color = cfg.color;
  const unit = cfg.unit;

  const chartData = React.useMemo(() => {
    const hist = [...readings].reverse().map((r) => ({
      date: r.timestamp,
      value: getMetricValue(r, metric),
    }));
    if (metric === "ammonia" && predictions?.length) {
      const forecast = predictions.map((p) => ({
        date: p.timestamp,
        forecast: p.predictedAmmonia,
      }));
      // merge for shadcn-style single line with forecast as second key
      // For simplicity, show history + forecast as separate points in same array
      // Recharts will handle gaps
      const merged = [
        ...hist.map((h) => ({ date: h.date, value: h.value })),
        ...forecast.map((f) => ({ date: f.date, value: undefined, forecast: f.forecast })),
      ];
      return merged;
    }
    return hist.map((h) => ({ date: h.date, value: h.value }));
  }, [readings, predictions, metric]);

  const chartConfig = {
    value: { label, color },
    forecast: { label: t("modal.forecastLegend"), color },
  } satisfies ChartConfig;

  const last = [...readings].reverse()[0];
  const currentVal = last ? getMetricValue(last, metric) : 0;
  const isAmmoniaSafe = metric === "ammonia" ? currentVal < 1.0 : true;

  return (
    <Card className="py-4 sm:py-4">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 py-3 sm:py-4">
          <CardTitle>{label}</CardTitle>
          <CardDescription className="flex flex-wrap gap-x-2 gap-y-1 leading-relaxed pr-2">
            <span>{label}</span>
            <span className="whitespace-nowrap">– {currentVal.toFixed(2)} {unit}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const d = new Date(value);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>
                    new Date(value as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line dataKey="value" type="monotone" stroke={color} strokeWidth={2} dot={false} />
            {metric === "ammonia" && predictions && <Line dataKey="forecast" type="monotone" stroke={color} strokeWidth={2} strokeDasharray="6 3" dot={false} />}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <div className={`mx-6 mb-6 flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5 ${isAmmoniaSafe ? "border-safe/30 bg-safe/10" : "border-alert/30 bg-alert/10"}`}>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isAmmoniaSafe ? "bg-safe" : "bg-alert"}`} />
        <span className={`whitespace-nowrap text-xs font-medium ${isAmmoniaSafe ? "text-safe" : "text-alert"}`}>{t("modal.current")} {label}:</span>
        <span className={`whitespace-nowrap text-sm font-bold ${isAmmoniaSafe ? "text-safe" : "text-alert"}`}>{currentVal.toFixed(2)} {unit}</span>
        <span className={`ml-auto shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${isAmmoniaSafe ? "bg-safe/15 text-safe" : "bg-alert/15 text-alert"}`}>{isAmmoniaSafe ? t("modal.safe") : t("modal.critical")}</span>
      </div>
    </Card>
  );
}
