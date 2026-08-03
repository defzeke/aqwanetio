export default function DiurnalCycleCard() {
  return (
    <section className="lg:col-span-6 min-w-0 bg-white border border-[#c4c6ce] rounded-[2px] flex flex-col gap-4 p-[25px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex gap-2 items-center">
            <h3 className="text-[16px] text-[#000f22]">Diurnal Cycle (24h)</h3>
            <span className="bg-[#eceef0] rounded-[2px] px-2 py-0.5 text-[10px] text-[#43474d]">10.7% SIGNAL</span>
          </div>
          <p className="text-[11px] text-[#43474d] leading-[16.5px]">
            Aggregated 24-hour periodic oxygen/temp fluctuation.
          </p>
        </div>
        <ClockIcon />
      </div>
      <div className="border border-[#c4c6ce] rounded-[2px] h-[128px] relative bg-[repeating-linear-gradient(180deg,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_32px),repeating-linear-gradient(90deg,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_48px)]">
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full px-4 py-2">
          <path d="M0,60 C40,25 80,25 100,60 C120,95 160,95 200,60 C240,25 280,25 320,60 C340,80 370,80 400,60" fill="none" stroke="#006c49" strokeWidth="2" />
        </svg>
        <span className="absolute bottom-1 left-2 text-[8px] text-[#43474d]">00:00</span>
        <span className="absolute bottom-1 right-2 text-[8px] text-[#43474d]">23:59</span>
      </div>
      <div className="flex gap-2 justify-center">
        {[
          { label: "PEAK TIME", value: "14:15", color: "#191c1e" },
          { label: "AMPLITUDE", value: "±1.4 mg/L", color: "#191c1e" },
          { label: "STABILITY", value: "High", color: "#006c49" },
        ].map((t) => (
          <div key={t.label} className="bg-[#f2f4f6] rounded-[2px] flex-1 flex flex-col gap-1 p-2">
            <span className="text-[9px] text-[#43474d] leading-[13.5px]">{t.label}</span>
            <span className="text-[12px] font-mono font-medium leading-4" style={{ color: t.color }}>
              {t.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="#43474d" strokeWidth="1.3"/>
      <path d="M9 5V9L11.5 11" stroke="#43474d" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
