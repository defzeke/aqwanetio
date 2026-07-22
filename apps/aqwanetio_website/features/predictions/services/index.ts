import type { PredictionsService } from "./predictions.service";
import { mockPredictionsService } from "./predictions.mock";

export type { Prediction, PredictionsService, StlDecomposition } from "./predictions.service";

export const predictionsService: PredictionsService = mockPredictionsService;
