import type { Prediction } from "../services/predictions.service";

export default function PredictionPanel({
  predictions,
}: {
  predictions: Prediction[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-background text-xs font-semibold text-text-muted">
          <tr>
            <th className="px-4 py-3">Forecast</th>
            <th className="px-4 py-3">Predicted NH₃</th>
            <th className="px-4 py-3">Range</th>
            <th className="px-4 py-3">Bias</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-text">
          {predictions.map((p, i) => (
            <tr key={i} className="hover:bg-background/50">
              <td className="px-4 py-2.5 text-text-muted">
                {new Date(p.timestamp).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2.5 font-medium">{p.predictedAmmonia}</td>
              <td className="px-4 py-2.5 text-text-muted">
                {p.lowerBound} – {p.upperBound}
              </td>
              <td className="px-4 py-2.5">{p.biasCorrection}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
