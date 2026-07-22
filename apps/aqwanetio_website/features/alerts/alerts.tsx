import { alertsService } from "./services";
import AlertBanner from "./components/AlertBanner";

export default function Alerts() {
  const alerts = alertsService.getActive();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Active Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <AlertBanner key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
