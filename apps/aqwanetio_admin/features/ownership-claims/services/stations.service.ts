export type AdminStation = {
  stationId: number;
  location: string;
  municipality: string;
  province: string | null;
  region: string;
  latitude: number;
  longitude: number;
  ownerId: string | null;
};

let cache: AdminStation[] | null = null;

export async function fetchStations(signal?: AbortSignal): Promise<AdminStation[]> {
  if (cache) return cache;
  const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API}/stations`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`GET /stations ${res.status}`);
  const rows = await res.json();
  cache = Array.isArray(rows) ? (rows as AdminStation[]) : [];
  return cache;
}

export function clearStationsCache() {
  cache = null;
}
