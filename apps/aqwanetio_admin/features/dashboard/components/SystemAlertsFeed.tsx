import { nodesService } from "@/services";

const severityStyles = {
  critical: "bg-admin-red-bg/20 border-l-4 border-[#ba1a1a] shadow-sm",
  info: "bg-admin-gray-100 border-l-4 border-admin-gray-300 shadow-sm",
};

const severityTextColor = {
  critical: "text-admin-red-text",
  info: "text-admin-text-secondary",
};

export default function SystemAlertsFeed() {
  const alerts = nodesService.getAlerts();

  return (
    <div className="col-span-12 lg:col-span-4 row-span-1 bg-admin-bg border border-admin-border rounded-sm flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-admin-border">
        <h3 className="text-[20px] font-semibold text-admin-text">System Alerts</h3>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <circle cx="9" cy="6" r="5" stroke="#43474d" strokeWidth="1.5"/>
          <circle cx="9" cy="6" r="1.5" fill="#43474d"/>
        </svg>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex gap-4 p-3 rounded ${severityStyles[alert.severity]}`}>
            <div className="shrink-0 size-5">
              {alert.severity === "critical" ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#ba1a1a" strokeWidth="1.5"/>
                  <line x1="10" y1="6" x2="10" y2="11" stroke="#ba1a1a" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="14" r="0.75" fill="#ba1a1a"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#43474d" strokeWidth="1.5"/>
                  <path d="M10 6V10M10 14V13.99" stroke="#43474d" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className={`text-[11px] font-bold tracking-[0.55px] ${severityTextColor[alert.severity]}`}>
                {alert.title}
              </span>
              <p className="text-[12px] text-admin-gray-400 leading-4">{alert.description}</p>
              <span className="text-[10px] font-mono font-medium text-admin-text-secondary">
                {alert.timestamp} &bull; {alert.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
