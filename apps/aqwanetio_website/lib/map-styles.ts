import { useEffect, useRef, useState } from "react";
import type {
  StyleSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

export type MapStyleId = "colored" | "minimal" | "satellite";

const DARK_MATTER_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const POSITRON_URL =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const VOYAGER_URL =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  name: "Satellite",
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: "Powered by Esri",
    },
  },
  layers: [{ id: "esri-satellite", type: "raster", source: "esri-satellite" }],
};

export type MapStyles = {
  light: string | StyleSpecification;
  dark: string | StyleSpecification;
};

export const MAP_STYLES: Record<MapStyleId, MapStyles> = {
  colored: { light: VOYAGER_URL, dark: DARK_MATTER_URL },
  minimal: { light: POSITRON_URL, dark: POSITRON_URL },
  satellite: { light: SATELLITE_STYLE, dark: SATELLITE_STYLE },
};

const LABEL_POSITION: [number, number] = [115.6, 17.0];

const CARTO_SEA_NAME = "South China Sea";
const OVERRIDE_TEXT = "WEST PHILIPPINE SEA";

function excludeSeaName(filter: unknown): unknown {
  const existing: unknown[] =
    Array.isArray(filter) && filter[0] === "all"
      ? (filter as unknown[]).slice(1)
      : Array.isArray(filter) && filter.length > 0
        ? [filter]
        : [];

  return [
    "all",
    ...existing,
    ["!=", "name", CARTO_SEA_NAME],
    ["!=", "name:en", CARTO_SEA_NAME],
    ["!=", "name:latin", CARTO_SEA_NAME],
  ];
}

async function buildPatchedStyle(url: string): Promise<StyleSpecification> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch map style: ${res.status}`);
  const style = (await res.json()) as StyleSpecification;

  const idx = style.layers.findIndex((l) => l.id === "watername_sea");
  if (idx === -1) return style; 

  const seaLayer = style.layers[idx] as SymbolLayerSpecification;
  seaLayer.filter = excludeSeaName(
    seaLayer.filter,
  ) as SymbolLayerSpecification["filter"];

  const labelLayer: SymbolLayerSpecification = {
    id: "wps-label",
    type: "symbol",
    source: "wps-label",
    minzoom: seaLayer.minzoom,
    layout: {
      ...seaLayer.layout,
      "text-field": OVERRIDE_TEXT,
    },
    paint: seaLayer.paint,
  };

  style.sources["wps-label"] = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: LABEL_POSITION },
          properties: {},
        },
      ],
    },
  };
  style.layers.splice(idx + 1, 0, labelLayer);
  return style;
}

const styleCache = new Map<MapStyleId, MapStyles>();
const pending = new Map<MapStyleId, Promise<MapStyles>>();

function patchedFor(id: MapStyleId): Promise<MapStyles> {
  const cached = styleCache.get(id);
  if (cached) return Promise.resolve(cached);
  const inFlight = pending.get(id);
  if (inFlight) return inFlight;

  const urls = MAP_STYLES[id];
  if (typeof urls.light !== "string") {
    styleCache.set(id, urls);
    return Promise.resolve(urls);
  }

  const promise = (async () => {
    try {
      const [light, dark] = await Promise.all([
        buildPatchedStyle(urls.light as string),
        buildPatchedStyle(urls.dark as string),
      ]);
      const styles = { light, dark };
      styleCache.set(id, styles);
      return styles;
    } catch {
      styleCache.set(id, urls);
      return urls;
    }
  })();
  pending.set(id, promise);
  return promise;
}

export function useMapStyles(activeId: MapStyleId): {
  active: MapStyles;
  ready: boolean;
} {
  const [patched, setPatched] = useState<Partial<Record<MapStyleId, MapStyles>>>(
    {},
  );
  const initialId = useRef(activeId).current;

  useEffect(() => {
    let cancelled = false;
    patchedFor(activeId).then((styles) => {
      if (!cancelled) setPatched((prev) => ({ ...prev, [activeId]: styles }));
    });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const active = patched[activeId] ?? MAP_STYLES[activeId];
  const ready = patched[initialId] !== undefined;
  return { active, ready };
}
