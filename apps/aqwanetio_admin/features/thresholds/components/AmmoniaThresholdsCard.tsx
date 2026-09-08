export default function AmmoniaThresholdsCard() {
  return (
    <section className="col-span-12 lg:col-span-7 bg-admin-surface border border-admin-border rounded-sm drop-shadow-sm flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <AmmoniaIcon />
          <h2 className="text-[20px] font-semibold text-admin-text">Ammonia Thresholds (NH₃)</h2>
        </div>
        <span className="bg-[rgba(108,248,187,0.2)] rounded-sm px-2 py-0.5 text-[11px] font-bold text-admin-green tracking-[0.55px]">
          Real-time Validation Active
        </span>
      </div>

      <div className="flex gap-8 justify-center pb-4">
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">WARNING TRIGGER (PPM)</label>
          <div className="flex items-center">
            <div className="flex-1 bg-admin-sidebar border border-admin-border rounded-sm p-3">
              <span className="text-[13px] font-mono font-medium text-admin-gray-400">0.4</span>
            </div>
            <span className="pl-3 text-[16px] font-mono font-medium text-amber-600">ppm</span>
          </div>
          <p className="text-[12px] text-admin-text-secondary leading-4">
            Triggers Yellow Alert and local node<br />visual signal.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px]">TOXIC LIMIT (PPM)</label>
          <div className="flex items-center">
            <div className="flex-1 bg-admin-red-bg/20 border border-[#ba1a1a] rounded-sm p-3">
              <span className="text-[13px] font-mono font-medium text-admin-red">1.0</span>
            </div>
            <span className="pl-3 text-[16px] font-mono font-medium text-admin-red">ppm</span>
          </div>
          <p className="text-[12px] text-admin-text-secondary leading-4">
            Triggers Red Alert and emergency SMS<br />escalation.
          </p>
        </div>
      </div>

      <div className="border-t border-admin-border pt-[25px]">
        <p className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] pb-2">OPTIMAL OPERATIONAL RANGE</p>
        <div className="bg-admin-gray-100 h-12 rounded-sm relative overflow-clip">
          <div className="absolute inset-[0_80%_0_0] bg-admin-green opacity-10" />
          <div className="absolute left-[20%] right-1/2 top-0 bottom-0 bg-admin-green flex items-center justify-center">
            <span className="text-[9px] text-white tracking-[0.9px]">SAFE ZONE</span>
          </div>
          <div className="absolute left-1/2 right-[10%] top-0 bottom-0 bg-[rgba(255,185,95,0.3)]" />
          <div className="absolute inset-[0_0_0_90%] bg-admin-red" />
        </div>
        <div className="flex items-start justify-between px-1 mt-[5px]">
          <span className="text-[10px] font-mono font-medium text-admin-text-secondary">0.0</span>
          <span className="text-[10px] font-mono font-medium text-admin-green">0.2 - 0.5 (SAFE)</span>
          <span className="text-[10px] font-mono font-medium text-admin-text-secondary">0.8</span>
          <span className="text-[10px] font-mono font-medium text-admin-red">1.0+</span>
        </div>
      </div>
    </section>
  );
}

function AmmoniaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C9 2 5.5 6.5 5.5 9.5C5.5 11.4 7.1 13 9 13C10.9 13 12.5 11.4 12.5 9.5C12.5 6.5 9 2 9 2Z" stroke="#000f22" strokeWidth="1.3" fill="none"/>
    </svg>
  );
}
