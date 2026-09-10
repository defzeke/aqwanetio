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
import { fetchStations, type Station } from "@/features/stations/services/stations.service";
import { useAuth } from "@/lib/auth-context";
import ClaimPondModal from "./ClaimPondModal";

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
  const [stations, setStations] = useState<Station[]>([]);
  const [claimStation, setClaimStation] = useState<Station | null>(null);
  const [claimMock, setClaimMock] = useState(() => pondsService.getAll()[0]);
  const { theme, mapStyle, setMapStyle } = useSettings();
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { active: styles, ready } = useMapStyles(mapStyle);

  const ponds = pondsService.getAll();
  const focusedStation = focusedId ? stations.find((s) => String(s.stationId) === focusedId) : undefined;
  const focusedPondForStation = focusedStation
    ? ponds[stations.findIndex((s) => String(s.stationId) === focusedId) % ponds.length] || ponds[0]
    : undefined;

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStations(ctrl.signal)
      .then((rows) => {
        if (!ctrl.signal.aborted) setStations(rows);
      })
      .catch((e: any) => {
        if (e?.name === "AbortError") return;
        console.warn("GET /stations failed (backend down on :8000?)", e);
        if (!ctrl.signal.aborted) setStations([]);
      });
    return () => ctrl.abort();
  }, []);

  const handleFocus = useCallback(
    (pondId: string) => {
      const station = stations.find((s) => String(s.stationId) === pondId);
      if (station) {
        setFocusedId(pondId);
        mapRef.current?.flyTo({
          center: [station.longitude, station.latitude],
          zoom: 13,
          duration: 1200,
        });
        return;
      }
      const pond = pondsService.getById(pondId);
      if (!pond) return;
      setFocusedId(pondId);
      mapRef.current?.flyTo({
        center: [pond.lng, pond.lat],
        zoom: 13,
        duration: 1200,
      });
    },
    [stations]
  );
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
        {stations.map((station, idx) => {
          // keep safe/warning/toxic + NH3 from mock datas (ponds) per index
          const mock = ponds[idx % ponds.length] || ponds[0];
          return (
            <MapMarker
              key={station.stationId}
              longitude={station.longitude}
              latitude={station.latitude}
              onClick={() => setFocusedId(null)}
            >
              <MarkerContent>
                <div
                  className={`h-6 w-6 cursor-pointer rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${statusDot[mock.status]}`}
                />
              </MarkerContent>
              <MarkerTooltip className="border border-line bg-surface text-ink shadow-[var(--shadow-raise-sm)]">
                {station.location}
              </MarkerTooltip>
              <MarkerPopup className="w-64 border-line">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{station.location}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusChip[mock.status]}`}
                    >
                      NH₃ {mock.ammoniaLevel} ppm
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    {station.municipality}, {station.province} • {station.region}
                  </p>
                  <p className="text-xs text-muted">
                    {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPondSelect(mock.id)}
                    className="btn btn-ghost w-full rounded-lg px-3 py-1.5 text-xs font-semibold"
                  >
                    {t("mapPopup.viewDetails")}
                  </button>
                  {station.ownerId ? (
                    <p className="text-xs font-semibold text-ink">
                      {t("mapPopup.ownedBy", { name: station.ownerName ?? "—" })}
                    </p>
                  ) : user && !loading ? (
                    <button
                      type="button"
                      onClick={() => {
                        setClaimMock(mock);
                        setClaimStation(station);
                      }}
                      className="btn btn-cyan w-full rounded-lg px-3 py-1.5 text-xs font-bold"
                    >
                      {t("mapPopup.claimPond")}
                    </button>
                  ) : null}
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
        {focusedStation && focusedPondForStation && (
          <MapPopup
            longitude={focusedStation.longitude}
            latitude={focusedStation.latitude}
            closeButton
            onClose={() => setFocusedId(null)}
            className="border-line"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink">{focusedStation.location}</p>
              <p className="text-xs text-muted">
                {focusedStation.municipality}, {focusedStation.province} • {focusedStation.region}
              </p>
              <p className="text-xs text-muted">NH₃ {focusedPondForStation.ammoniaLevel} ppm</p>
            </div>
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
      {claimStation && (
        <ClaimPondModal station={claimStation} mock={claimMock} onClose={() => setClaimStation(null)} />
      )}
    </div>
  );
}
