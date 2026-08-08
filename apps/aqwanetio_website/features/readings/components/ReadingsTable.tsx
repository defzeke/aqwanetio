import type { Reading } from "../services/readings.service";

export default function ReadingsTable({ readings }: { readings: Reading[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line shadow-[var(--shadow-raise-sm)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-raised text-xs font-semibold text-muted">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">NH₃ (ppm)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-ink">
          {readings.map((r, i) => (
            <tr key={i} className="hover:bg-raised/60">
              <td className="px-4 py-2.5 text-muted">
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
