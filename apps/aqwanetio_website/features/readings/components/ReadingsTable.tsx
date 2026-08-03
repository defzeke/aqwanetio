import type { Reading } from "../services/readings.service";

export default function ReadingsTable({ readings }: { readings: Reading[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-background text-xs font-semibold text-text-muted">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">NH₃ (ppm)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-text">
          {readings.map((r, i) => (
            <tr key={i} className="hover:bg-background/50">
              <td className="px-4 py-2.5 text-text-muted">
                {new Date(r.timestamp).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2.5">{r.ammonia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
