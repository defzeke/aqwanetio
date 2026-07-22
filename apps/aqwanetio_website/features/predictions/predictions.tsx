import { predictionsService } from "./services";
import PredictionPanel from "./components/PredictionPanel";

export default function Predictions({ pondId = "pond-1" }: { pondId?: string }) {
  const predictions = predictionsService.getPrediction(pondId);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Ammonia Forecast</h2>
      <PredictionPanel predictions={predictions} />
    </div>
  );
}
