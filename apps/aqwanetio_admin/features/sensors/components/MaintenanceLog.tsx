import { nodesService } from "@/services";

export default function MaintenanceLog() {
  const logs = nodesService.getMaintenanceLogs();

  return (
    <div className="bg-white border border-[#c4c6ce] rounded-sm flex-1 p-6">
      <div className="flex items-center gap-2 mb-8">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path d="M1 5H17M1 5V17C1 18.1 1.9 19 3 19H15C16.1 19 17 18.1 17 17V5M1 5L3 1H15L17 5" stroke="#43474d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="5" y1="9" x2="13" y2="9" stroke="#43474d" strokeWidth="1.5"/>
          <line x1="5" y1="13" x2="11" y2="13" stroke="#43474d" strokeWidth="1.5"/>
        </svg>
        <h4 className="text-[20px] font-semibold text-[#191c1e]">Recent Maintenance</h4>
      </div>
      <div className="flex flex-col gap-8">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
            <div className="text-[17px] font-bold text-[#43474d] leading-5 shrink-0">
              {log.date.split("-").slice(1).join("/")}
            </div>
            <div>
              <p className="text-[14px] text-[#191c1e] leading-5">{log.description}</p>
              <p className="text-[10px] font-mono font-medium text-[#43474d] mt-1">by {log.technician}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
