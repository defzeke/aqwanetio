"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import MapLegend from "@/features/ponds/components/MapLegend";
import MapCtaCard from "@/features/ponds/components/MapCtaCard";

const PondMap = dynamic(
  () => import("@/features/ponds/components/PondMap"),
  { ssr: false }
);

const PondDetailModal = dynamic(
  () => import("@/features/ponds/components/PondDetailModal"),
  { ssr: false }
);

export default function MapPage() {
  const [selectedPondId, setSelectedPondId] = useState<string | null>(null);
  const [panelsHidden, setPanelsHidden] = useState(false);
  const onPondSelect = useCallback((id: string) => setSelectedPondId(id), []);

  return (
    <>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PondMap onPondSelect={onPondSelect} />
          <div
            className={[
              "absolute inset-y-0 right-0 z-[1001]",
              "flex flex-col items-end justify-between",
              "pt-[84px] pb-4 pr-3 sm:pr-5",
              "pointer-events-none",
              "transition-transform duration-300 ease-in-out",
              panelsHidden ? "translate-x-full" : "",
            ].join(" ")}
          >
            <div className="pointer-events-auto">
              <MapLegend />
            </div>

            <div className="pointer-events-auto">
              <MapCtaCard />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPanelsHidden((v) => !v)}
            aria-label={panelsHidden ? "Show overlay panels" : "Hide overlay panels"}
            className={[
              "absolute right-0 top-1/2 -translate-y-1/2 z-[1002]",
              "flex h-12 w-6 items-center justify-center",
              "rounded-l-xl border border-r-0 border-line",
              "bg-surface shadow-[var(--shadow-raise-sm)] backdrop-blur-[4px]",
              "transition-colors hover:bg-raised",
            ].join(" ")}
          >
            <svg
              className={[
                "h-4 w-4 text-muted",
                "transition-transform duration-300",
                panelsHidden ? "rotate-180" : "",
              ].join(" ")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {selectedPondId && (
        <PondDetailModal
          pondId={selectedPondId}
          onClose={() => setSelectedPondId(null)}
        />
      )}
    </>
  );
}
