import type { Reading, ReadingsService } from "./readings.service";

function buildDataset(seed: number, count: number, endTs: number = Date.now()): Reading[] {
  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = i;
    const phase = seed * 1.3 + (endTs / 3_600_000) * 0.35;
    const baseAmmonia = 0.25 + Math.sin((hoursAgo + phase) / 6) * 0.15;
    const noise = Math.sin(hoursAgo * 7.3 + seed) * 0.04;
    // ponytail: deterministic per-metric sin for frontend-only mock
    const mk = (base: number, amp: number, period: number, n: number) =>
      +(base + Math.sin((hoursAgo + phase) / period) * amp + Math.sin(hoursAgo * n + seed * 0.7) * amp * 0.25).toFixed(3);
    return {
      timestamp: new Date(endTs - hoursAgo * 3600_000).toISOString(),
      ammonia: Math.max(0, +(baseAmmonia + noise).toFixed(3)),
      param210: Math.max(0, mk(0.35, 0.12, 7, 5.3)),
      param218: Math.max(0, mk(0.30, 0.10, 8, 6.1)),
      param176: Math.max(0.5, mk(6.2, 0.9, 9, 4.2)),
      param177: Math.max(60, mk(88, 10, 10, 3.8)),
      param209: mk(7.6, 0.35, 12, 3.1),
      param217: mk(5, 18, 11, 4.5),
      param170: mk(27.5, 1.2, 14, 2.9),
      param173: Math.max(0, mk(2.5, 0.8, 13, 5.7)),
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
