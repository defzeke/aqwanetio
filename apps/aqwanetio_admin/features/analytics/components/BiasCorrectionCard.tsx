export default function BiasCorrectionCard() {
  return (
    <section className="col-span-4 bg-white border border-[#e2e8f0] rounded-[8px] flex flex-col justify-between p-[25px]">
      <div>
        <div className="flex gap-2 items-center">
          <BiasIcon />
          <h3 className="text-[11px] font-bold text-[#43474d] tracking-[0.55px] uppercase">Bias Correction Panel</h3>
        </div>
        <div className="bg-[rgba(54,31,0,0.05)] border border-[rgba(25,12,0,0.1)] rounded-[4px] h-[127px] relative mt-4">
          <p className="absolute left-4 top-4 text-[16px] text-[#43474d] leading-6">
            Current Active Correction<br />Factor
          </p>
          <div className="absolute left-4 top-[90px] -translate-y-1/2 flex items-baseline gap-2">
            <span className="text-[30px] font-mono font-medium text-[#190c00] leading-9">-0.014</span>
            <span className="text-[18px] font-mono font-medium text-[#190c00]">ppm</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center mt-6">
        <button className="border border-[#74777e] rounded-[4px] px-[17px] py-[9px] w-[123px] text-[11px] font-bold text-[#000f22] tracking-[0.55px]">
          Recalibrate
        </button>
        <button className="bg-[#000f22] rounded-[4px] px-4 py-[9px] w-[121px] text-[11px] font-bold text-white tracking-[0.55px]">
          Adjust Factor
        </button>
      </div>
    </section>
  );
}

function BiasIcon() {
  return (
    <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
      <line x1="1" y1="4" x2="21" y2="4" stroke="#43474d" strokeWidth="1.5"/>
      <line x1="1" y1="9.5" x2="21" y2="9.5" stroke="#43474d" strokeWidth="1.5"/>
      <line x1="1" y1="15" x2="21" y2="15" stroke="#43474d" strokeWidth="1.5"/>
      <circle cx="7" cy="4" r="2.5" fill="white" stroke="#43474d" strokeWidth="1.5"/>
      <circle cx="15" cy="9.5" r="2.5" fill="white" stroke="#43474d" strokeWidth="1.5"/>
      <circle cx="11" cy="15" r="2.5" fill="white" stroke="#43474d" strokeWidth="1.5"/>
    </svg>
  );
}
