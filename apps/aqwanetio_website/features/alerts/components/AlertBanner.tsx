import { useState } from "react";
import type { Alert } from "../services/alerts.service";
import { alertsService } from "../services";

export default function AlertBanner({ alert }: { alert: Alert }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const isToxic = alert.severity === "toxic";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isToxic
          ? "border-alert/20 bg-alert/5"
          : "border-warning/20 bg-warning/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
              isToxic
                ? "bg-alert/10 text-alert"
                : "bg-warning/10 text-warning"
            }`}
          >
            {alert.severity}
          </span>
          <p className="text-sm text-ink">{alert.message}</p>
          <p className="text-xs text-muted">{alert.recommendation}</p>
        </div>
        <button
          onClick={() => {
            alertsService.acknowledge(alert.id);
            setDismissed(true);
          }}
          className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-ink"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
