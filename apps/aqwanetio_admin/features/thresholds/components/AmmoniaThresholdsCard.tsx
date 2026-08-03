export default function AmmoniaThresholdsCard() {
  return (
    <section className="col-span-7 bg-white border border-[#c4c6ce] rounded-[2px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-6 p-[25px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <AmmoniaIcon />
          <h2 className="text-[20px] font-semibold text-[#000f22]">Ammonia Thresholds (NH₃)</h2>
        </div>
        <span className="bg-[rgba(108,248,187,0.2)] rounded-[2px] px-2 py-0.5 text-[11px] font-bold text-[#006c49] tracking-[0.55px]">
          Real-time Validation Active
        </span>
      </div>

      <div className="flex gap-8 justify-center pb-4">
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-bold text-[#43474d] tracking-[0.55px]">WARNING TRIGGER (PPM)</label>
          <div className="flex items-center">
            <div className="flex-1 bg-[#f2f4f6] border border-[#c4c6ce] rounded-[2px] p-[13px]">
              <span className="text-[13px] font-mono font-medium text-[#191c1e]">0.4</span>
            </div>
            <span className="pl-3 text-[16px] font-mono font-medium text-[#c27c00]">ppm</span>
          </div>
          <p className="text-[12px] text-[#43474d] leading-4">
            Triggers Yellow Alert and local node<br />visual signal.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-bold text-[#43474d] tracking-[0.55px]">TOXIC LIMIT (PPM)</label>
          <div className="flex items-center">
            <div className="flex-1 bg-[rgba(255,218,214,0.2)] border border-[#ba1a1a] rounded-[2px] p-[13px]">
              <span className="text-[13px] font-mono font-medium text-[#ba1a1a]">1.0</span>
            </div>
            <span className="pl-3 text-[16px] font-mono font-medium text-[#ba1a1a]">ppm</span>
          </div>
          <p className="text-[12px] text-[#43474d] leading-4">
            Triggers Red Alert and emergency SMS<br />escalation.
          </p>
        </div>
      </div>

      <div className="border-t border-[#c4c6ce] pt-[25px]">
        <p className="text-[11px] font-bold text-[#43474d] tracking-[0.55px] pb-2">OPTIMAL OPERATIONAL RANGE</p>
        <div className="bg-[#eceef0] h-12 rounded-[2px] relative overflow-clip">
          <div className="absolute inset-[0_80%_0_0] bg-[#006c49] opacity-10" />
          <div className="absolute left-[20%] right-1/2 top-0 bottom-0 bg-[#006c49] flex items-center justify-center">
            <span className="text-[9px] text-white tracking-[0.9px]">SAFE ZONE</span>
          </div>
          <div className="absolute left-1/2 right-[10%] top-0 bottom-0 bg-[rgba(255,185,95,0.3)]" />
          <div className="absolute inset-[0_0_0_90%] bg-[#ba1a1a]" />
        </div>
        <div className="flex items-start justify-between px-1 mt-[5px]">
          <span className="text-[10px] font-mono font-medium text-[#43474d]">0.0</span>
          <span className="text-[10px] font-mono font-medium text-[#006c49]">0.2 - 0.5 (SAFE)</span>
          <span className="text-[10px] font-mono font-medium text-[#43474d]">0.8</span>
          <span className="text-[10px] font-mono font-medium text-[#ba1a1a]">1.0+</span>
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
