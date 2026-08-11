import type { Reading, ReadingsService } from "./readings.service";

function buildDataset(seed: number, count: number, endTs: number = Date.now()): Reading[] {
  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = i;
    const phase = seed * 1.3 + (endTs / 3_600_000) * 0.35;
    const baseAmmonia = 0.25 + Math.sin((hoursAgo + phase) / 6) * 0.15;
    // Deterministic "noise" using sin harmonics — no Math.random()
    const noise = Math.sin(hoursAgo * 7.3 + seed) * 0.04;
    return {
      timestamp: new Date(endTs - hoursAgo * 3600_000).toISOString(),
      ammonia: Math.max(0, +(baseAmmonia + noise).toFixed(3)),
    };
  });
}


function seedFor(pondId: string): number {
  const m = pondId.match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

const POND_IDS = ["pond-1","pond-2","pond-3","pond-4","pond-5",
                  "pond-6","pond-7","pond-8","pond-9","pond-10"];

const readingsCache = new Map<string, Reading[]>(
  POND_IDS.map((id) => [id, buildDataset(seedFor(id), 96)])
);

export const mockReadingsService: ReadingsService = {
  getLatestByPond: (pondId) => {
    const data = readingsCache.get(pondId) ?? buildDataset(seedFor(pondId), 24);
    return data[0];
  },
  getByPond: (pondId, limit = 48) => {
    const data = readingsCache.get(pondId) ?? buildDataset(seedFor(pondId), 96);
    return data.slice(0, limit);
  },
  getByPondAt: (pondId, endTs, limit = 48) =>
    buildDataset(seedFor(pondId), limit, endTs),
};
