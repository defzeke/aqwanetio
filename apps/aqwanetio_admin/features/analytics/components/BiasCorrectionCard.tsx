export default function BiasCorrectionCard() {
  return (
    <section className="col-span-12 lg:col-span-4 bg-admin-surface border border-admin-border rounded-sm flex flex-col justify-between p-6">
      <div>
        <div className="flex gap-2 items-center">
          <BiasIcon />
          <h3 className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] uppercase">Bias Correction Panel</h3>
        </div>
        <div className="bg-amber-950/5 border border-amber-950/10 rounded-sm h-[127px] relative mt-4">
          <p className="absolute left-4 top-4 text-[16px] text-admin-text-secondary leading-6">
            Current Active Correction<br />Factor
          </p>
          <div className="absolute left-4 top-[90px] -translate-y-1/2 flex items-baseline gap-2">
            <span className="text-[30px] font-mono font-medium text-amber-950 leading-9">-0.014</span>
            <span className="text-[18px] font-mono font-medium text-amber-950">ppm</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center mt-6">
        <button className="border border-admin-gray-300 rounded-sm px-4 py-2 w-[123px] text-[11px] font-bold text-admin-text tracking-[0.55px]">
          Recalibrate
        </button>
        <button className="bg-admin-text rounded-sm px-4 py-2 w-[121px] text-[11px] font-bold text-white tracking-[0.55px]">
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
