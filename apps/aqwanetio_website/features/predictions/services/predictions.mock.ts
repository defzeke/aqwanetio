import type { Prediction, PredictionsService } from "./predictions.service";

function buildPredictions(seed: number, endTs: number = Date.now()): Prediction[] {
  const phase = seed * 1.3 + (endTs / 3_600_000) * 0.35;
  return Array.from({ length: 6 }, (_, i) => {
    const hoursAhead = i + 1;
    const predicted = Math.max(
      0,
      0.3 + Math.sin((endTs / 3_600_000 + hoursAhead + phase) / 6) * 0.2
           + Math.sin(hoursAhead * 5.1 + seed) * 0.03
    );
    const bias = -0.014;
    return {
      timestamp: new Date(endTs + hoursAhead * 3_600_000).toISOString(),
      predictedAmmonia: +(predicted + bias).toFixed(3),
      upperBound: +(predicted + bias + 0.1).toFixed(3),
      lowerBound: +Math.max(0, predicted + bias - 0.1).toFixed(3),
      biasCorrection: bias,
    };
  });
}

function seedFor(pondId: string): number {
  const m = pondId.match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

const POND_IDS = ["pond-1","pond-2","pond-3","pond-4","pond-5",
                  "pond-6","pond-7","pond-8","pond-9","pond-10"];

const predictionsCache = new Map<string, Prediction[]>(
  POND_IDS.map((id) => [id, buildPredictions(seedFor(id))])
);

export const mockPredictionsService: PredictionsService = {
  getPrediction: (pondId) =>
    predictionsCache.get(pondId) ?? buildPredictions(seedFor(pondId)),
  getPredictionAt: (pondId, endTs) => buildPredictions(seedFor(pondId), endTs),
  getStlDecomposition: (pondId) => {
    const s = seedFor(pondId);
    return {
      trend: Array.from({ length: 48 }, (_, i) => +(0.2 + i * 0.005 + Math.sin(i * 1.1 + s) * 0.01).toFixed(3)),
      seasonal: Array.from({ length: 48 }, (_, i) => +(Math.sin(i / 6 + s) * 0.1).toFixed(3)),
      residual: Array.from({ length: 48 }, (_, i) => +(Math.sin(i * 13.7 + s * 3.1) * 0.025).toFixed(3)),
    };
  },
};
