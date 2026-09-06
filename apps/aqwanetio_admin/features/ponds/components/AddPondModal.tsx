"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = { open: boolean; onClose: () => void };

export default function AddPondModal({ open, onClose }: Props) {
  const [location, setLocation] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [region, setRegion] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setLocation("");
      setMunicipality("");
      setProvince("");
      setRegion("");
      setLat(null);
      setLng(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !mapRef.current || mapInstance.current) return;
    let cancelled = false;
    (async () => {
      const maplibre = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled || !mapRef.current) return;
      if (!maplibre.getWorkerUrl()) {
        maplibre.setWorkerUrl(`https://unpkg.com/maplibre-gl@${maplibre.getVersion()}/dist/maplibre-gl-worker.mjs`);
      }
      const map = new maplibre.Map({
        container: mapRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        } as any,
        center: [121.5, 12],
        zoom: 5.3,
        minZoom: 5,
        maxZoom: 14,
        maxBounds: [
          [116.0, 4.0],
          [127.5, 21.5],
        ],
        renderWorldCopies: false,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
      const fitPH = () => map.fitBounds([[116.5, 4.2], [126.8, 21.5]], { padding: 24, duration: 0 });
      map.on("load", () => {
        map.resize();
        fitPH();
        // ponytail: faint PH bbox outline — visual cue, not clip
        if (!map.getSource("ph-bounds")) {
          map.addSource("ph-bounds", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [[[116.0, 4.0], [127.5, 4.0], [127.5, 21.5], [116.0, 21.5], [116.0, 4.0]]],
              },
            },
          } as any);
          map.addLayer({
            id: "ph-outline",
            type: "line",
            source: "ph-bounds",
            paint: { "line-color": "#006c49", "line-width": 1.2, "line-dasharray": [2, 2], "line-opacity": 0.45 },
          } as any);
        }
      });
      // resize after portal paint (fixed container was 0x0 before) — ponytail: raster OSM always paints PH
      setTimeout(() => {
        map.resize();
        fitPH();
      }, 80);
      setTimeout(() => {
        map.resize();
        fitPH();
      }, 350);

      const insidePH = (lat: number, lng: number) => lat >= 4.0 && lat <= 21.5 && lng >= 116.0 && lng <= 127.5;
      map.on("click", (e: any) => {
        const { lat: clat, lng: clng } = e.lngLat;
        if (!insidePH(clat, clng)) return;
        setLat(clat);
        setLng(clng);
        if (markerRef.current) markerRef.current.setLngLat([clng, clat]);
        else {
          const el = document.createElement("div");
          el.className = "size-3.5 rounded-full bg-admin-green border-2 border-white shadow-md";
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.background = "#006c49";
          markerRef.current = new maplibre.Marker({ element: el, draggable: true }).setLngLat([clng, clat]).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current.getLngLat();
            if (!insidePH(pos.lat, pos.lng)) return;
            setLat(pos.lat);
            setLng(pos.lng);
          });
        }
      });
      mapInstance.current = map;
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open && mapInstance.current) {
      try {
        mapInstance.current.remove();
      } catch {}
      mapInstance.current = null;
      markerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  const canConfirm = location.trim() && municipality.trim() && province.trim() && region.trim() && lat !== null && lng !== null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,15,34,0.18)] ring-1 ring-black/5 w-full max-w-[min(600px,calc(100vw-1.5rem))] max-h-[90dvh] overflow-hidden flex flex-col">
        {/* header */}
        <div className="px-4 sm:px-7 py-4 sm:py-5 bg-gradient-to-r from-white to-admin-bg border-b border-admin-border/60 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-[20px] font-bold tracking-tight text-admin-text">Add New Pond</h2>
            <p className="text-xs sm:text-[12px] text-admin-text-muted mt-1">Fill details and pin the exact location on the map.</p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="size-8 shrink-0 flex items-center justify-center rounded-full hover:bg-black/5 text-admin-text-secondary transition"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-7 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">LOCATION</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sitio Bagasbas"
                className="w-full rounded-xl border border-admin-border/70 bg-white px-4 py-2.5 text-sm text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green transition"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">MUNICIPALITY</span>
              <input
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder="e.g. Daet"
                className="w-full rounded-xl border border-admin-border/70 bg-white px-4 py-2.5 text-sm text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green transition"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">PROVINCE</span>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Camarines Norte"
                className="w-full rounded-xl border border-admin-border/70 bg-white px-4 py-2.5 text-sm text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green transition"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">REGION</span>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Region V"
                className="w-full rounded-xl border border-admin-border/70 bg-white px-4 py-2.5 text-sm text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green transition"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">PICK EXACT LOCATION</span>
            <div
              ref={mapRef}
              className="h-[220px] sm:h-[280px] lg:h-[340px] w-full rounded-xl ring-1 ring-black/5 overflow-hidden bg-admin-sidebar shadow-inner"
            />
            <p className="text-[11px] text-admin-text-muted flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-admin-green" /> Click map to drop pin • Drag pin to adjust • Philippines auto-framed
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">LATITUDE</span>
              <input
                readOnly
                value={lat !== null ? lat.toFixed(6) : ""}
                placeholder="— click map —"
                className="w-full rounded-xl border border-dashed border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text font-mono placeholder:text-admin-text-muted"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">LONGITUDE</span>
              <input
                readOnly
                value={lng !== null ? lng.toFixed(6) : ""}
                placeholder="— click map —"
                className="w-full rounded-xl border border-dashed border-admin-border bg-admin-bg px-4 py-2.5 text-sm text-admin-text font-mono placeholder:text-admin-text-muted"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 sm:px-7 py-4 border-t border-admin-border/60 bg-white/80 backdrop-blur">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-admin-border bg-white text-[11px] font-bold tracking-[0.55px] text-admin-text-secondary hover:bg-admin-gray-100 transition"
          >
            CANCEL
          </button>
          <button
            disabled={!canConfirm}
            onClick={() => {
              console.log({ location, municipality, province, region, latitude: lat, longitude: lng });
              onClose();
            }}
            className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.55px] text-white shadow-md transition ${
              canConfirm ? "bg-admin-text hover:shadow-lg hover:-translate-y-px" : "bg-admin-text opacity-50 cursor-not-allowed"
            }`}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : modal;
}
