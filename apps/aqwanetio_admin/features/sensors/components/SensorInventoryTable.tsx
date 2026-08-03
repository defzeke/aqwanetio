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
    <div className="bg-white border border-[#c4c6ce] rounded-sm shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full overflow-clip">
      <div className="flex items-center justify-between px-6 pt-4 pb-[17px] border-b border-[#c4c6ce]">
        <h3 className="text-[20px] font-semibold text-[#191c1e]">Sensor Hardware Inventory</h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="size-2 rounded-full bg-[#006c49]" />
            <span className="text-[10px] text-[#191c1e]">Online: {online}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="size-2 rounded-full bg-[#ba1a1a]" />
            <span className="text-[10px] text-[#191c1e]">Offline: {offline}</span>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f2f4f6] border-b border-[#c4c6ce]">
              {["SENSOR ID", "POND MAPPING", "DEPTH", "BATTERY", "STATUS", "CALIBRATION", "DRIFT", "ACTIONS"].map((h) => (
                <th key={h} className={`text-[11px] font-bold text-[#43474d] tracking-[0.55px] px-4 py-3 ${
                  h === "DEPTH" ? "text-right" : "text-left"
                }`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensors.map((s, i) => (
              <tr key={s.id} className={i > 0 ? "border-t border-[#c4c6ce]" : ""}>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-mono font-medium text-[#191c1e]">{s.id}</span>
                </td>
                <td className="px-4 py-3 text-[14px] text-[#191c1e]">{s.pondMapping}</td>
                <td className="px-4 py-3">
                  <span className="text-[13px] font-mono font-medium text-[#191c1e] text-right block">{s.depth}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <BatteryIcon level={s.battery} />
                    <span className="text-[13px] font-mono font-medium text-[#191c1e]">{s.battery}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <div className={`size-1.5 rounded-full ${s.online ? "bg-[#006c49]" : "bg-[#ba1a1a]"}`} />
                    <span className={`text-[10px] ${s.online ? "text-[#00714d]" : "text-[#93000a]"}`}>
                      {s.online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#43474d]">{s.lastCalibration}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] ${
                    s.drift === "nominal"
                      ? "bg-[#6cf8bb] text-[#00714d]"
                      : "bg-[#ffdad6] text-[#93000a]"
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
