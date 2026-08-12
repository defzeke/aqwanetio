"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pondsService } from "../services";
import { usePondFocus } from "@/lib/pond-focus";
import { useTranslation } from "@/lib/translations";

const statusColors: Record<string, string> = {
  safe: "#22c55e",
  warning: "#eab308",
  toxic: "#ef4444",
};

function getNightOverlayOpacity(): number {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  return Math.max(0, 0.5 * Math.cos((hour - 2) * Math.PI / 12));
}

const PondMap = memo(function PondMap({
  onPondSelect,
}: {
  onPondSelect: (pondId: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayPaneRef = useRef<HTMLElement | null>(null);
  const markersRef = useRef(new Map<string, L.CircleMarker>());
  const [zoom, setZoom] = useState(6);
  const { t } = useTranslation();

  const hideMarkers = useCallback(() => {
    if (overlayPaneRef.current) overlayPaneRef.current.style.visibility = "hidden";
  }, []);

  const showMarkers = useCallback(() => {
    if (overlayPaneRef.current) overlayPaneRef.current.style.visibility = "";
  }, []);

  const handleFocus = useCallback((pondId: string) => {
    const map = mapInstanceRef.current;
    const pond = pondsService.getById(pondId);
    const marker = markersRef.current.get(pondId);
    if (!map || !pond || !marker) return;
    hideMarkers();
    map.flyTo([pond.lat, pond.lng], 13, { duration: 1.2 });
    map.once("moveend", () => {
      showMarkers();
      marker.openTooltip();
    });
  }, [hideMarkers, showMarkers]);
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

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const ponds = pondsService.getAll();
    const bounds = L.latLngBounds([]);
    const markers = markersRef.current;

    const phBounds = L.latLngBounds([3.0, 113.0], [22.0, 128.0]);

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      maxBounds: phBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
    }).setView([14.5, 121.5], 8);

    const syncZoom = () => setZoom(map.getZoom());
    map.on("zoomend", syncZoom);
    syncZoom();

    overlayPaneRef.current = map.getPane("overlayPane") ?? null;
    map.on("dragstart", showMarkers);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    ponds.forEach((pond) => {
      const marker = L.circleMarker([pond.lat, pond.lng], {
        radius: 12,
        fillColor: statusColors[pond.status],
        color: "#fff",
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindTooltip(pond.name, {
        permanent: false,
        direction: "top",
        offset: L.point(0, -12),
      });

      marker.on("click", () => onPondSelect(pond.id));

      bounds.extend([pond.lat, pond.lng]);
      markers.set(pond.id, marker);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.off("dragstart", showMarkers);
      map.remove();
      mapInstanceRef.current = null;
      markers.clear();
    };
  }, [onPondSelect, showMarkers]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute left-3 top-1/2 z-[1000] flex -translate-y-1/2 flex-col rounded-2xl border border-line bg-surface/85 shadow-[var(--shadow-raise-sm)] backdrop-blur-[4px]">
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          disabled={zoom >= 18}
          aria-label={t("ui.zoomIn")}
          className="flex h-10 w-10 items-center justify-center rounded-t-2xl text-muted transition-colors hover:bg-raised hover:text-ink disabled:opacity-40"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <div className="mx-2 border-t border-line" />
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          disabled={zoom <= 6}
          aria-label={t("ui.zoomOut")}
          className="flex h-10 w-10 items-center justify-center rounded-b-2xl text-muted transition-colors hover:bg-raised hover:text-ink disabled:opacity-40"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>
      </div>
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ backgroundColor: "rgba(0,0,0,0)", opacity: 0 }}
      />
    </div>
  );
});

export default PondMap;
