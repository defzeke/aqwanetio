function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="bg-[#eceef0] h-[6px] rounded-full w-full overflow-clip">
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

export default function GatewayHealthCard() {
  return (
    <div className="bg-white border border-[#c4c6ce] rounded-sm shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 p-[25px] pb-[108px]">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-semibold text-[#191c1e]">Gateway Health</h3>
        <span className="bg-[#6cf8bb] text-[#00714d] text-[11px] font-bold tracking-[0.55px] px-2 py-0.5 rounded">STABLE</span>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-[11px] font-bold text-[#43474d] tracking-[0.55px]">CPU USAGE (QUAD-CORE)</span>
            <span className="text-[13px] font-mono font-medium text-[#43474d]">24%</span>
          </div>
          <ProgressBar value={24} color="#000f22" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-[11px] font-bold text-[#43474d] tracking-[0.55px]">RAM UTILIZATION (8GB)</span>
            <span className="text-[13px] font-mono font-medium text-[#43474d]">3.2 GB</span>
          </div>
          <ProgressBar value={60} color="#006c49" />
        </div>
        <div className="border-t border-[#c4c6ce] flex gap-4 pt-[17px] w-full">
          <div className="flex-1">
            <p className="text-[10px] text-[#43474d] uppercase">UPTIME</p>
            <p className="text-[13px] font-mono font-medium text-[#191c1e]">14d 06h 22m</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-[#43474d] uppercase">CLOUD SYNC</p>
            <p className="text-[13px] font-mono font-medium text-[#006c49]">ACTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
