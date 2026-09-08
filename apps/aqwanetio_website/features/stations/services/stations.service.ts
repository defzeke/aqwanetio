export type Station = {
  stationId: number;
  location: string;
  municipality: string;
  province: string;
  region: string;
  latitude: number;
  longitude: number;
};

let cache: Station[] | null = null;

export async function fetchStations(signal?: AbortSignal): Promise<Station[]> {
  if (cache) return cache;
  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API}/stations`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`GET /stations ${res.status}`);
  const rows = await res.json();
  cache = Array.isArray(rows) ? (rows as Station[]) : [];
  return cache;
}

export function clearStationsCache() {
  cache = null;
}
