import type { Prediction, PredictionsService } from "./predictions.service";

function generatePrediction(hoursAhead: number): Prediction {
  const predicted = Math.max(0, 0.3 + Math.sin((Date.now() / 3600000 + hoursAhead) / 6) * 0.2 + Math.random() * 0.05);
  const bias = -0.014;
  return {
    timestamp: new Date(Date.now() + hoursAhead * 3600000).toISOString(),
    predictedAmmonia: +(predicted + bias).toFixed(3),
    upperBound: +(predicted + bias + 0.1).toFixed(3),
    lowerBound: +Math.max(0, predicted + bias - 0.1).toFixed(3),
    biasCorrection: bias,
  };
}

export const mockPredictionsService: PredictionsService = {
  getPrediction: (pondId) => { void pondId; return Array.from({ length: 6 }, (_, i) => generatePrediction(i + 1)); },
  getStlDecomposition: (pondId) => {
    void pondId;
    return {
      trend: Array.from({ length: 48 }, (_, i) => +(0.2 + i * 0.005).toFixed(3)),
      seasonal: Array.from({ length: 48 }, (_, i) => +(Math.sin(i / 6) * 0.1).toFixed(3)),
      residual: Array.from({ length: 48 }, () => +((Math.random() - 0.5) * 0.05).toFixed(3)),
    };
  },
};
