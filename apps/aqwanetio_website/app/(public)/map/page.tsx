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
  const onPondSelect = useCallback((id: string) => setSelectedPondId(id), []);

  return (
    <>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PondMap onPondSelect={onPondSelect} />
          <MapLegend />
          <MapCtaCard />
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
