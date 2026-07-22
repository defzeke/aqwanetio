"use client";

import { useTranslation } from "@/lib/translations";

export default function MapLegend() {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-gray-300 bg-white/90 p-3 shadow-md backdrop-blur-[4px] md:p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-navy">{t("mapLegend.title")}</h3>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22c55e]" />
          <span className="text-sm text-gray-900">{t("mapLegend.safe")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ef4444]" />
          <span className="text-sm text-gray-900">{t("mapLegend.critical")}</span>
        </div>
      </div>
    </div>
  );
}
