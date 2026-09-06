export default function NetworkReachCard() {
  return (
    <div className="bg-admin-surface border border-admin-border rounded-sm shadow-sm flex flex-col gap-6 p-6 h-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-semibold text-admin-gray-400">868 MHz Network Reach</h3>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            <div className="size-3 rounded-full bg-admin-green" />
            <span className="text-[10px] text-admin-text-secondary">OPTIMAL</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="size-3 rounded-full bg-amber-400" />
            <span className="text-[10px] text-admin-text-secondary">FRINGE</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="col-span-1 sm:col-span-2 bg-admin-sidebar border border-admin-border rounded-sm h-[192px] flex items-center justify-center">
          <div className="bg-admin-green/10 border border-admin-green rounded-2xl size-24 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 4 5 4 9C4 13 8 18 12 22C16 18 20 13 20 9C20 5 16 2 12 2Z" stroke="#006c49" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="9" r="2" fill="#006c49"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-admin-sidebar border border-admin-border rounded-sm p-3">
            <p className="text-[10px] text-admin-text-secondary">AVG SNR</p>
            <p className="text-[18px] font-mono font-medium text-admin-text">+8.5 dB</p>
          </div>
          <div className="bg-admin-sidebar border border-admin-border rounded-sm p-3">
            <p className="text-[10px] text-admin-text-secondary">PACKET LOSS</p>
            <p className="text-[18px] font-mono font-medium text-admin-green">0.02%</p>
          </div>
          <div className="bg-admin-sidebar border border-admin-border rounded-sm p-3">
            <p className="text-[10px] text-admin-text-secondary">ACTIVE NODES</p>
            <p className="text-[18px] font-mono font-medium text-admin-text">12 / 12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
