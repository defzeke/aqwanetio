"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { mockReadingsService } from "@/features/readings/services/readings.mock";
import { useTranslation } from "@/lib/translations";

function normalize(value: number, min: number, max: number, invert = false): number {
  const n = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return invert ? 1 - n : n;
}

export default function PondHealthRadar({ pondId }: { pondId: string }) {
  const { t } = useTranslation();
  const r = mockReadingsService.getByPond(pondId, 1)[0];

  const data = useMemo(() => {
    if (!r) return [];
    const scores = [
      { month: t("metrics.p209"), desktop: Math.max(0, Math.min(100, Math.round(normalize(r.param209, 6.5, 9, false) * 100))) },
      { month: t("metrics.p176"), desktop: Math.max(0, Math.min(100, Math.round(normalize(r.param176, 3, 8, false) * 100))) },
      { month: t("metrics.p170"), desktop: Math.max(0, Math.min(100, Math.round((1 - Math.abs(r.param170 - 27.5) / 3) * 100))) },
      { month: t("metrics.p173"), desktop: Math.max(0, Math.min(100, Math.round(normalize(r.param173, 5, 0, true) * 100))) },
      { month: t("metrics.p210"), desktop: Math.max(0, Math.min(100, Math.round(normalize(r.param210, 1, 0, true) * 100))) },
    ];
    return scores;
  }, [r, t]);

  const chartConfig = {
    desktop: { label: "Health", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  if (!r) return null;

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{t("charts.radarTitle")}</CardTitle>
        <CardDescription>{t("charts.radarDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {t("charts.radarDesc")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">Health 0-100 – higher is healthier</div>
      </CardFooter>
    </Card>
  );
}
