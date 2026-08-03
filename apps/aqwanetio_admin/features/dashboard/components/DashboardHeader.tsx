export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-[32px] font-bold text-[#000f22] tracking-[-0.64px] leading-10">System Overview</h1>
        <p className="text-[16px] text-[#43474d] leading-6">Real-time telemetry and industrial node diagnostics.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 items-center bg-[#6cf8bb] rounded-full px-3 py-1">
          <div className="size-1.5 rounded-full bg-[#006c49]" />
          <span className="text-[12px] font-medium text-[#00714d] font-mono">LIVE DATA STREAMING</span>
        </div>
        <div className="h-6 w-px bg-[#c4c6ce]" />
        <button className="flex gap-2 items-center bg-[#f7f9fb] border border-[#c4c6ce] rounded px-[17px] py-[9px] text-[11px] font-bold text-[#43474d] tracking-[0.55px]">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <rect x="1" y="1" width="3" height="10" rx="1" fill="currentColor"/>
            <rect x="6" y="4" width="3" height="7" rx="1" fill="currentColor"/>
          </svg>
          LAST 24H
        </button>
      </div>
    </div>
  );
}
