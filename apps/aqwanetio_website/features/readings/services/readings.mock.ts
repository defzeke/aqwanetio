import type { Reading, ReadingsService } from "./readings.service";

function generateReading(hoursAgo: number): Reading {
  const baseAmmonia = 0.3 + Math.sin(hoursAgo / 6) * 0.15;
  return {
    timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    ammonia: Math.max(0, +(baseAmmonia + Math.random() * 0.1).toFixed(3)),
    temperature: +(26 + Math.sin(hoursAgo / 24) * 2 + Math.random() * 0.5).toFixed(1),
    ph: +(7.5 + Math.sin(hoursAgo / 12) * 0.3 + Math.random() * 0.1).toFixed(2),
    dissolvedOxygen: +(5 + Math.sin(hoursAgo / 8) * 0.5 + Math.random() * 0.3).toFixed(1),
  };
}

const readingsCache = new Map<string, Reading[]>();

export const mockReadingsService: ReadingsService = {
  getLatestByPond: (pondId) => {
    const readings = readingsCache.get(pondId);
    if (!readings) {
      const fresh = Array.from({ length: 24 }, (_, i) => generateReading(i));
      readingsCache.set(pondId, fresh);
      return fresh[0];
    }
    return readings[0];
  },
  getByPond: (pondId, limit = 48) => {
    if (!readingsCache.has(pondId)) {
      readingsCache.set(pondId, Array.from({ length: 96 }, (_, i) => generateReading(i)));
    }
    return readingsCache.get(pondId)!.slice(0, limit);
  },
};
