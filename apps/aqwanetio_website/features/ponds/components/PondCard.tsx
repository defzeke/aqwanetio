import type { Pond } from "../services/ponds.service";

const statusStyles: Record<string, string> = {
  safe: "bg-safe/10 text-safe border-safe/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  toxic: "bg-alert/10 text-alert border-alert/20",
};

export default function PondCard({ pond }: { pond: Pond }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      <div>
        <h3 className="text-sm font-semibold text-text">{pond.name}</h3>
        <p className="mt-0.5 text-xs text-text-muted">NH₃: {pond.ammoniaLevel} ppm</p>
      </div>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
          statusStyles[pond.status]
        }`}
      >
        {pond.status}
      </span>
    </div>
  );
}
