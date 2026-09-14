export type Station = {
  stationId: number;
  location: string;
  municipality: string;
  province: string;
  region: string;
  latitude: number;
  longitude: number;
  ownerId?: string | null;
  ownerName?: string | null;
};

// ponytail: always hit Neon – no in-memory cache, no localStorage for ownership
export async function fetchStations(signal?: AbortSignal): Promise<Station[]> {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API}/stations`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`GET /stations ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) ? (rows as Station[]) : [];
}

export function clearStationsCache() {
  // kept for compat – no cache to clear
}
