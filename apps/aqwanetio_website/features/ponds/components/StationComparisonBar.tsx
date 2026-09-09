"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { mockReadingsService } from "@/features/readings/services/readings.mock";
import type { MetricId } from "@/features/readings/services/readings.service";
import { fetchStations, type Station } from "@/features/stations/services/stations.service";
import { useTranslation } from "@/lib/translations";

const METRIC_LABEL_KEY: Record<MetricId | "ammonia", string> = {
  ammonia: "modal.ammonia",
  "210": "metrics.p210",
  "218": "metrics.p218",
  "176": "metrics.p176",
  "177": "metrics.p177",
  "209": "metrics.p209",
  "217": "metrics.p217",
  "170": "metrics.p170",
  "173": "metrics.p173",
};

const METRIC_COLOR: Record<MetricId | "ammonia", string> = {
  ammonia: "var(--color-cyan)",
  "210": "#0e7490",
  "218": "#0891b2",
  "176": "#2563eb",
  "177": "#38bdf8",
  "209": "#9333ea",
  "217": "#7c3aed",
  "170": "#ea580c",
  "173": "#0d9488",
};

function getMetricFromReading(r: any, metric: MetricId | "ammonia"): number {
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

export default function StationComparisonBar({ metric = "209" as MetricId | "ammonia" }: { metric?: MetricId | "ammonia" }) {
  const { t } = useTranslation();
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStations(ctrl.signal)
      .then((rows) => {
        if (!ctrl.signal.aborted) setStations(rows);
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError") console.warn("GET /stations failed for bar", e);
        if (!ctrl.signal.aborted) setStations([]);
      });
    return () => ctrl.abort();
  }, []);

  const data = useMemo(() => {
    return stations.map((s) => {
      const r = mockReadingsService.getByPond(String(s.stationId), 1)[0];
      const v = r ? getMetricFromReading(r, metric) : 0;
      return { name: s.location, value: +v.toFixed(2) };
    });
  }, [stations, metric]);

  const label = t(METRIC_LABEL_KEY[metric] || "metrics.p209");
  const color = METRIC_COLOR[metric] || "var(--color-cyan)";

  const chartConfig = {
    value: { label, color },
  } satisfies ChartConfig;

  if (stations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.barTitle")} – {label}</CardTitle>
          <CardDescription>{t("charts.comparisonDesc", { count: stations.length, label })}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted">No stations yet – add via Admin POST /stations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.barTitle")} – {label}</CardTitle>
        <CardDescription>{t("charts.comparisonDesc", { count: stations.length, label })}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value: string) => value.slice(0, 12)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {label} across {stations.length} stations <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing current {label.toLowerCase()} values</div>
      </CardFooter>
    </Card>
  );
}
