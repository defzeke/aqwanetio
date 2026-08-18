"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map as MapCn,
  MapMarker,
  MapControls,
  MapPopup,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  useMap,
  type MapRef,
} from "@/components/ui/map";
import { pondsService, type PondStatus } from "../services";
import { usePondFocus } from "@/lib/pond-focus";
import { useTranslation } from "@/lib/translations";
import { useSettings } from "@/lib/settings-context";
import { useMapStyles } from "@/lib/map-styles";
import MapStyleSwitcher from "./MapStyleSwitcher";

const statusDot: Record<PondStatus, string> = {
  safe: "bg-safe",
  warning: "bg-warning",
  toxic: "bg-alert",
};

const statusChip: Record<PondStatus, string> = {
  safe: "bg-safe/10 text-safe border-safe/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  toxic: "bg-alert/10 text-alert border-alert/20",
};

const PH_BOUNDS: [[number, number], [number, number]] = [
  [113, 3],
  [128, 22],
];

function getNightOverlayOpacity(): number {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  return Math.max(0, 0.5 * Math.cos(((hour - 2) * Math.PI) / 12));
}

function FitPhilippines() {
  const { map, isLoaded } = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (!isLoaded || !map || fitted.current) return;
    fitted.current = true;
    map.fitBounds(PH_BOUNDS, {
      padding: { top: 70, right: 330, bottom: 80, left: 70 },
      duration: 0,
    });
  }, [isLoaded, map]);
  return null;
}

export default function PondMap({
  onPondSelect,
}: {
  onPondSelect: (pondId: string) => void;
}) {
  const mapRef = useRef<MapRef>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const { theme, mapStyle, setMapStyle } = useSettings();
  const { t } = useTranslation();
  const { active: styles, ready } = useMapStyles(mapStyle);

  const ponds = pondsService.getAll();
  const focusedPond = focusedId ? pondsService.getById(focusedId) : undefined;

  const handleFocus = useCallback((pondId: string) => {
    const pond = pondsService.getById(pondId);
    if (!pond) return;
    setFocusedId(pondId);
    mapRef.current?.flyTo({
      center: [pond.lng, pond.lat],
      zoom: 13,
      duration: 1200,
    });
  }, []);
  usePondFocus(handleFocus);

  useEffect(() => {
    const update = () => {
      const el = overlayRef.current;
      if (el) el.style.opacity = String(getNightOverlayOpacity());
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      {ready && (
        <MapCn
          ref={mapRef}
          styles={styles}
          center={[121.5, 14.5]}
          zoom={8}
          minZoom={6}
          maxZoom={18}
          maxBounds={PH_BOUNDS}
          theme={theme}
        >
        <FitPhilippines />
        <MapControls position="bottom-left" showZoom showCompass showLocate />
        {ponds.map((pond) => (
          <MapMarker
            key={pond.id}
            longitude={pond.lng}
            latitude={pond.lat}
            onClick={() => setFocusedId(null)}
          >
            <MarkerContent>
              <div
                className={`h-6 w-6 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${statusDot[pond.status]}`}
              />
            </MarkerContent>
            <MarkerTooltip className="border border-line bg-surface text-ink shadow-[var(--shadow-raise-sm)]">
              {pond.name}
            </MarkerTooltip>
            <MarkerPopup className="w-56 border-line">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{pond.name}</p>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusChip[pond.status]}`}
                  >
                    NH₃ {pond.ammoniaLevel} ppm
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onPondSelect(pond.id)}
                  className="btn btn-ghost w-full rounded-lg px-3 py-1.5 text-xs font-semibold"
                >
                  {t("mapPopup.viewDetails")}
                </button>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
        {focusedPond && (
          <MapPopup
            longitude={focusedPond.lng}
            latitude={focusedPond.lat}
            closeButton
            onClose={() => setFocusedId(null)}
            className="border-line"
          >
            <p className="text-sm font-semibold text-ink">{focusedPond.name}</p>
            <p className="text-xs text-muted">NH₃ {focusedPond.ammoniaLevel} ppm</p>
          </MapPopup>
        )}
        </MapCn>
      )}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ backgroundColor: "rgba(0,0,0,0)", opacity: 0 }}
      />
      <MapStyleSwitcher current={mapStyle} onChange={setMapStyle} />
    </div>
  );
}
