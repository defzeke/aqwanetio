import { nodesService } from "@/services";

const iconMap = {
  ammonia: (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="10" fill="#006c49" fillOpacity="0.1"/>
      <path d="M17 10C17 10 12 16 12 20C12 23 14 25 17 25C20 25 22 23 22 20C22 16 17 10 17 10Z" stroke="#006c49" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  alerts: (
    <svg width="38" height="35" viewBox="0 0 38 35" fill="none">
      <rect x="1" y="1" width="36" height="33" rx="10" fill="#ba1a1a" fillOpacity="0.1"/>
      <path d="M19 10L27 26H11L19 10Z" stroke="#ba1a1a" strokeWidth="1.5" fill="none"/>
      <circle cx="19" cy="21" r="1.5" fill="#ba1a1a"/>
      <line x1="19" y1="15" x2="19" y2="19" stroke="#ba1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  uptime: (
    <svg width="36" height="33" viewBox="0 0 36 33" fill="none">
      <rect width="36" height="33" rx="10" fill="#006c49" fillOpacity="0.1"/>
      <path d="M18 22V14M18 14L14 18M18 14L22 18" stroke="#006c49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 20C28 25 24 28 18 28C12 28 8 25 8 20" stroke="#006c49" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  latency: (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
      <rect width="36" height="32" rx="10" fill="#314865" fillOpacity="0.1"/>
      <circle cx="18" cy="16" r="8" stroke="#314865" strokeWidth="1.5" fill="none"/>
      <line x1="18" y1="16" x2="22" y2="12" stroke="#314865" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="16" r="2" fill="#314865"/>
    </svg>
  ),
};

export default function KpiCardGrid() {
  const kpis = nodesService.getKpis();

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="flex flex-col gap-1 bg-[#f7f9fb] border border-[#c4c6ce] rounded-sm p-[21px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between w-full">
            {iconMap[kpi.icon as keyof typeof iconMap]}
            <span className="text-[12px] font-medium text-[#006c49]" style={{ color: kpi.trendColor === "#ba1a1a" ? "#ba1a1a" : kpi.trendColor === "#314865" ? "#314865" : "#006c49" }}>
              {kpi.trend}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#43474d] tracking-[0.55px] pt-3">{kpi.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-bold text-[#000f22] tracking-[-0.64px]">{kpi.value}</span>
            {kpi.unit && <span className="text-[14px] text-[#43474d]">{kpi.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
