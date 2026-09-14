function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="bg-admin-gray-100 h-[6px] rounded-full w-full overflow-clip">
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

export default function GatewayHealthCard() {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-sm shadow-sm flex flex-col gap-6 p-6 h-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-semibold text-admin-gray-400">Gateway Health</h3>
        <span className="bg-admin-green-bg text-admin-green-text text-[11px] font-bold tracking-[0.55px] px-2 py-0.5 rounded">STABLE</span>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">CPU USAGE (QUAD-CORE)</span>
            <span className="text-[13px] font-mono font-medium text-admin-text-secondary">24%</span>
          </div>
          <ProgressBar value={24} color="#000f22" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">RAM UTILIZATION (8GB)</span>
            <span className="text-[13px] font-mono font-medium text-admin-text-secondary">3.2 GB</span>
          </div>
          <ProgressBar value={60} color="#006c49" />
        </div>
        <div className="border-t border-admin-border flex gap-4 pt-[17px] w-full">
          <div className="flex-1">
            <p className="text-[10px] text-admin-text-secondary uppercase">UPTIME</p>
            <p className="text-[13px] font-mono font-medium text-admin-gray-400">14d 06h 22m</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-admin-text-secondary uppercase">CLOUD SYNC</p>
            <p className="text-[13px] font-mono font-medium text-admin-green">ACTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
