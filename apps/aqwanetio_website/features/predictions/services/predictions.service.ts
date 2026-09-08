export interface Prediction {
  timestamp: string;
  predictedAmmonia: number;
  upperBound: number;
  lowerBound: number;
  biasCorrection: number;
}

export interface StlDecomposition {
  trend: number[];
  seasonal: number[];
  residual: number[];
}

export interface PredictionsService {
  getPrediction(pondId: string): Prediction[];
  getPredictionAt(pondId: string, endTs: number): Prediction[];
  getStlDecomposition(pondId: string): StlDecomposition;
}
