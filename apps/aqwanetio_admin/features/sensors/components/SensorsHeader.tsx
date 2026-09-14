export default function SensorsHeader() {
  return (
    <div className="flex items-end justify-between w-full">
      <div className="flex flex-col gap-1">
        <nav className="flex gap-2 items-center text-[10px] text-admin-text-secondary">
          <span>INFRASTRUCTURE</span>
          <svg width="4" height="6" viewBox="0 0 4 6" fill="none">
            <path d="M1 5L3 3L1 1" stroke="#43474d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-admin-text">SENSORS &amp; NETWORK</span>
        </nav>
        <h2 className="text-[20px] font-semibold text-admin-gray-400">Network Topology &amp; Telemetry</h2>
      </div>
      <div className="flex gap-2">
        <button className="border border-admin-border flex gap-2 items-center px-4 py-2 text-[11px] font-bold text-admin-gray-400 tracking-[0.55px]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Force Sync
        </button>
        <button className="border border-admin-border flex gap-2 items-center px-4 py-2 text-[11px] font-bold text-admin-gray-400 tracking-[0.55px]">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <rect x="1" y="1" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="3" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Calibrate Sensor
        </button>
        <button className="bg-admin-text flex gap-2 items-center px-4 py-2 text-[11px] font-bold text-white tracking-[0.55px]">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1V12M1 6.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Update Model
        </button>
      </div>
    </div>
  );
}
