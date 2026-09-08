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
      <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden z-0">
        <div className="absolute inset-0 z-0">
          <PondMap onPondSelect={onPondSelect} />
          <div
            className={[
              "absolute inset-y-0 right-0 z-[1001]",
              "flex items-stretch",
              "pointer-events-none",
              "transition-transform duration-300 ease-in-out",
              panelsHidden ? "translate-x-[calc(100%-2.5rem)]" : "",
            ].join(" ")}
          >
            <div className="flex items-center pt-[84px] pb-4 pointer-events-none">
              <button
                type="button"
                onClick={() => setPanelsHidden((v) => !v)}
                aria-label={panelsHidden ? "Show overlay panels" : "Hide overlay panels"}
                className={[
                  "pointer-events-auto",
                  "flex w-10 shrink-0 items-center justify-center",
                  "text-white/80 hover:text-white transition-colors",
                ].join(" ")}
              >
                <svg
                  className={[
                    "h-8 w-8 drop-shadow-md",
                    "transition-transform duration-300",
                    panelsHidden ? "rotate-180" : "",
                  ].join(" ")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-3 pt-[84px] pb-4 pr-3 sm:pr-5 pointer-events-none">
              <div className="pointer-events-auto">
                <MapLegend />
              </div>
              <div className="pointer-events-auto">
                <MapCtaCard />
              </div>
            </div>
          </div>
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
