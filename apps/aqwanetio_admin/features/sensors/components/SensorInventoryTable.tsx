import { nodesService } from "@/services";
import StatusBadge from "@/components/StatusBadge";

function BatteryIcon({ level }: { level: number }) {
  const fillColor = level > 60 ? "#006c49" : level > 20 ? "#ffb95f" : "#ba1a1a";
  const fillHeight = Math.round(level / 100 * 8);
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
      <rect x="0.5" y="0.5" width="5" height="9" rx="1" stroke="#191c1e" strokeOpacity="0.4"/>
      <rect x="2" y="10" width="2" height="1.5" rx="0.5" fill="#191c1e" fillOpacity="0.4"/>
      <rect x="1" y={10 - fillHeight} width="4" height={fillHeight} rx="0.5" fill={fillColor}/>
    </svg>
  );
}

export default function SensorInventoryTable() {
  const sensors = nodesService.getSensors();
  const online = sensors.filter((s) => s.online).length;
  const offline = sensors.length - online;
  const onlinePct = Math.round((online / sensors.length) * 100);

  return (
    <div className="bg-admin-surface border border-admin-border rounded-sm shadow-sm w-full overflow-clip">
      <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-admin-border">
        <h3 className="text-[20px] font-semibold text-admin-gray-400">Sensor Hardware Inventory</h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="size-2 rounded-full bg-admin-green" />
            <span className="text-[10px] text-admin-gray-400">Online: {online}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="size-2 rounded-full bg-admin-red" />
            <span className="text-[10px] text-admin-gray-400">Offline: {offline}</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-admin-sidebar border-b border-admin-border">
              {["SENSOR ID", "POND MAPPING", "DEPTH", "BATTERY", "STATUS", "CALIBRATION", "DRIFT", "ACTIONS"].map((h) => (
                <th key={h} className={`text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] px-4 py-3 ${
                  h === "DEPTH" ? "text-right" : "text-left"
                }`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensors.map((s, i) => (
              <tr key={s.id} className={i > 0 ? "border-t border-admin-border" : ""}>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-mono font-medium text-admin-gray-400">{s.id}</span>
                </td>
                <td className="px-4 py-3 text-[14px] text-admin-gray-400">{s.pondMapping}</td>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-mono font-medium text-admin-gray-400 text-right block">{s.depth}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <BatteryIcon level={s.battery} />
                    <span className="text-[13px] font-mono font-medium text-admin-gray-400">{s.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <div className={`size-1.5 rounded-full ${s.online ? "bg-admin-green" : "bg-admin-red"}`} />
                    <span className={`text-[10px] ${s.online ? "text-admin-green-text" : "text-admin-red-text"}`}>
                      {s.online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-text-secondary">{s.lastCalibration}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] ${
                    s.drift === "nominal"
                      ? "bg-admin-green-bg text-admin-green-text"
                      : "bg-admin-red-bg text-admin-red-text"
                  }`}>
                    {s.drift === "nominal" ? "NOMINAL" : "NEEDS CAL"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="size-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="5" r="1.5" fill="#43474d"/>
                      <circle cx="10" cy="10" r="1.5" fill="#43474d"/>
                      <circle cx="10" cy="15" r="1.5" fill="#43474d"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
