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
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isReverseLoading, setIsReverseLoading] = useState(false);
  const [reverseError, setReverseError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const lastFetchRef = useRef(0);

  async function reverseAndFill(lat: number, lng: number) {
    const now = Date.now();
    if (now - lastFetchRef.current < 1100) return; // ponytail: Nominatim 1 req/sec
    lastFetchRef.current = now;
    setIsReverseLoading(true);
    setReverseError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const a: any = data.address || {};
      // ponytail: PH address mapping — city/town/village → municipality, county/state → province
      const muni = a.city || a.town || a.municipality || a.village || a.hamlet || "";
      const prov = a.province || a.state || a.county || "";
      const reg = a.region || a.state_district || a.state || "";
      const loc = a.road || a.hamlet || a.suburb || a.village || a.neighbourhood || (data.display_name ? data.display_name.split(",")[0] : "") || "";
      if (muni) setMunicipality(muni);
      if (prov) setProvince(prov);
      if (reg) setRegion(reg);
      if (loc) setLocation(loc);
      setIsAutoFilled(true);
      if (!muni && !prov && !reg) {
        setReverseError("Pin is over water or unmapped area — fill manually or click Edit.");
        setIsAutoFilled(false);
      }
    } catch {
      setReverseError("Couldn’t resolve address — type manually or click Edit.");
      setIsAutoFilled(false);
    } finally {
      setIsReverseLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      setLocation("");
      setMunicipality("");
      setProvince("");
      setRegion("");
      setLat(null);
      setLng(null);
      setIsAutoFilled(false);
      setIsReverseLoading(false);
      setReverseError(null);
      setQ("");
      setSuggestions([]);
      setSearchLoading(false);
      setSearchError(null);
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
        reverseAndFill(clat, clng);
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
            reverseAndFill(pos.lat, pos.lng);
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

  async function doSearch() {
    const query = q.trim();
    if (!query) return;
    const now = Date.now();
    if (now - lastFetchRef.current < 1100) return;
    lastFetchRef.current = now;
    setSearchLoading(true);
    setSearchError(null);
    setSuggestions([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ph&viewbox=116,21.5,127.5,4&bounded=1&limit=5&addressdetails=1&accept-language=en`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!res.ok) throw new Error(String(res.status));
      const data: Array<{ display_name: string; lat: string; lon: string }> = await res.json();
      if (!data.length) {
        setSearchError("No place found in Philippines — try barangay + municipality.");
      } else {
        setSuggestions(data);
        // auto-fly to first result for speed (still show list)
        const first = data[0];
        flyToAndPin(parseFloat(first.lat), parseFloat(first.lon));
      }
    } catch {
      setSearchError("Search failed — try again.");
    } finally {
      setSearchLoading(false);
    }
  }

  function flyToAndPin(flat: number, flng: number) {
    const map = mapInstance.current;
    if (!map) {
      setLat(flat);
      setLng(flng);
      reverseAndFill(flat, flng);
      return;
    }
    map.flyTo({ center: [flng, flat], zoom: 14, duration: 1200 });
    setLat(flat);
    setLng(flng);
    reverseAndFill(flat, flng);
    // ensure marker at new spot
    setTimeout(() => {
      if (markerRef.current) markerRef.current.setLngLat([flng, flat]);
      else if (map) {
        import("maplibre-gl").then((ml) => {
          const el = document.createElement("div");
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.background = "#006c49";
          el.className = "size-3.5 rounded-full bg-admin-green border-2 border-white shadow-md";
          markerRef.current = new ml.Marker({ element: el, draggable: true }).setLngLat([flng, flat]).addTo(map);
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current.getLngLat();
            if (pos.lat < 4.0 || pos.lat > 21.5 || pos.lng < 116.0 || pos.lng > 127.5) return;
            setLat(pos.lat);
            setLng(pos.lng);
            reverseAndFill(pos.lat, pos.lng);
          });
        });
      }
    }, 200);
    setSuggestions([]);
    setQ("");
  }

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [created, setCreated] = useState<{ location: string; municipality: string } | null>(null);

  useEffect(() => {
    if (open) {
      setSubmitError(null);
      setSubmitting(false);
      setShowSuccess(false);
      setCreated(null);
    }
  }, [open]);

  const canConfirm = location.trim() && municipality.trim() && region.trim() && lat !== null && lng !== null && !submitting;

  async function handleConfirm() {
    if (!canConfirm || lat === null || lng === null) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const provinceVal = province.trim() ? province.trim() : null;
      const res = await fetch(`${api}/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.trim(), municipality: municipality.trim(), province: provinceVal, region: region.trim(), latitude: lat, longitude: lng }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const msg = typeof j.detail === "string" ? j.detail : Array.isArray(j.detail) ? j.detail.map((d: any) => d.msg).join("; ") : `HTTP ${res.status}`;
        throw new Error(msg);
      }
      setCreated({ location: location.trim(), municipality: municipality.trim() });
      setShowSuccess(true);
    } catch (e: any) {
      setSubmitError(e?.message || "Failed to save pond. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

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

        {showSuccess ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center py-10">
            <div className="size-12 rounded-full bg-admin-green-bg border border-admin-green/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="10" cy="10" r="9" stroke="#006c49" strokeWidth="1.3" />
                <path d="M6 10.5L9 13L14 7" stroke="#006c49" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-admin-text">Pond added successfully</h3>
            <p className="text-sm text-admin-text-secondary leading-5 max-w-[320px]">
              {created ? `${created.location} — ${created.municipality} is now in AqWaNetIO.` : "Your new pond is now saved."}
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-admin-text text-white text-[11px] font-bold tracking-[0.55px] shadow-md hover:shadow-lg hover:-translate-y-px transition"
            >
              DONE
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-7 overflow-auto">
              {(isReverseLoading || isAutoFilled || reverseError || submitError) && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-[11px] ${submitError || reverseError ? "bg-amber-100 text-amber-900 border border-amber-400" : isReverseLoading ? "bg-admin-bg text-admin-text-secondary border border-admin-border" : "bg-admin-green-bg text-admin-green-text border border-admin-green/20"}`}>
              <span className="flex items-center gap-2">
                {isReverseLoading ? "Locating address…" : submitError ? submitError : reverseError ? reverseError : "Auto-filled from map pin"}
                {isReverseLoading && <span className="size-3 animate-spin rounded-full border-2 border-admin-green border-t-transparent" />}
              </span>
              {(isAutoFilled || reverseError || submitError) && (
                <button
                  onClick={() => {
                    setIsAutoFilled(false);
                    setReverseError(null);
                    setSubmitError(null);
                  }}
                  className="text-[11px] font-bold underline hover:no-underline"
                >
                  Edit
                </button>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">LOCATION</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={isAutoFilled ? "— from map —" : "e.g. Sitio Bagasbas"}
                readOnly={isAutoFilled}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-admin-text-muted/60 focus:outline-none transition ${isAutoFilled ? "border-admin-border bg-admin-gray-100 text-admin-text cursor-not-allowed" : "border-admin-border/70 bg-white text-admin-text focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green"}`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">MUNICIPALITY</span>
              <input
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder={isAutoFilled ? "— from map —" : "e.g. Daet"}
                readOnly={isAutoFilled}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-admin-text-muted/60 focus:outline-none transition ${isAutoFilled ? "border-admin-border bg-admin-gray-100 text-admin-text cursor-not-allowed" : "border-admin-border/70 bg-white text-admin-text focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green"}`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">PROVINCE <span className="font-normal normal-case text-admin-text-muted">(optional)</span></span>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder={isAutoFilled ? "— from map (optional) —" : "e.g. Camarines Norte (optional)"}
                readOnly={isAutoFilled}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-admin-text-muted/60 focus:outline-none transition ${isAutoFilled ? "border-admin-border bg-admin-gray-100 text-admin-text cursor-not-allowed" : "border-admin-border/70 bg-white text-admin-text focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green"}`}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">REGION</span>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={isAutoFilled ? "— from map —" : "e.g. Region V"}
                readOnly={isAutoFilled}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-admin-text-muted/60 focus:outline-none transition ${isAutoFilled ? "border-admin-border bg-admin-gray-100 text-admin-text cursor-not-allowed" : "border-admin-border/70 bg-white text-admin-text focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green"}`}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-[0.8px] text-admin-text-secondary">PICK EXACT LOCATION</span>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted">⌕</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") doSearch();
                    if (e.key === "Escape") setSuggestions([]);
                  }}
                  placeholder="Search barangay, municipality… e.g. Bagasbas Daet"
                  className="w-full rounded-xl border border-admin-border/70 bg-white pl-9 pr-3 py-2.5 text-sm text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none focus:ring-2 focus:ring-admin-green/20 focus:border-admin-green transition"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-admin-border rounded-xl shadow-lg max-h-[180px] overflow-auto">
                    {suggestions.map((s, i) => (
                      <li key={i}>
                        <button
                          onClick={() => flyToAndPin(parseFloat(s.lat), parseFloat(s.lon))}
                          className="w-full text-left px-3 py-2.5 text-sm text-admin-text hover:bg-admin-bg border-b last:border-0 border-admin-border/30"
                        >
                          {s.display_name.split(",").slice(0, 3).join(", ")}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={doSearch}
                disabled={!q.trim() || searchLoading}
                className={`px-4 rounded-xl text-[11px] font-bold tracking-[0.55px] text-white shadow-md transition ${!q.trim() || searchLoading ? "bg-admin-text opacity-50 cursor-not-allowed" : "bg-admin-text hover:shadow-lg"}`}
              >
                {searchLoading ? "…" : "SEARCH"}
              </button>
            </div>
            {searchError && <p className="text-[11px] text-admin-red">{searchError}</p>}
            <div
              ref={mapRef}
              className="h-[220px] sm:h-[280px] lg:h-[340px] w-full rounded-xl ring-1 ring-black/5 overflow-hidden bg-admin-sidebar shadow-inner"
            />
            <p className="text-[11px] text-admin-text-muted flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-admin-green" /> Click map to drop pin • Drag pin to adjust • Philippines auto-framed • Or search above to fly there
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
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.55px] text-white shadow-md transition flex items-center gap-2 ${canConfirm ? "bg-admin-text hover:shadow-lg hover:-translate-y-px" : "bg-admin-text opacity-50 cursor-not-allowed"}`}
          >
            {submitting && <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {submitting ? "SAVING…" : "CONFIRM"}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : modal;
}
