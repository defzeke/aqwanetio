export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-[32px] font-bold text-admin-text tracking-[-0.64px] leading-10">System Overview</h1>
        <p className="text-[16px] text-admin-text-secondary leading-6">Real-time telemetry and industrial node diagnostics.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2 items-center bg-admin-green-bg rounded-full px-3 py-1">
          <div className="size-1.5 rounded-full bg-admin-green" />
          <span className="text-[12px] font-medium text-admin-green-text font-mono">LIVE DATA STREAMING</span>
        </div>
        <div className="h-6 w-px bg-[#c4c6ce]" />
        <button className="flex gap-2 items-center bg-admin-bg border border-admin-border rounded px-4 py-2 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">
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
