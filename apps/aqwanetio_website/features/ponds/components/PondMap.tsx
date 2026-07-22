"use client";

import { memo, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { pondsService } from "../services";

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

    const phBounds = L.latLngBounds([3.0, 113.0], [22.0, 128.0]);

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
      maxBounds: phBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
    }).setView([14.5, 121.5], 8);

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
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onPondSelect]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ backgroundColor: "rgba(0,0,0,0)", opacity: 0 }}
      />
    </div>
  );
});

export default PondMap;
