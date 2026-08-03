const histogramBars = [
  { h: 10.5, a: 0.2 },
  { h: 15.8, a: 0.2 },
  { h: 26.3, a: 0.4 },
  { h: 47.4, a: 0.4 },
  { h: 73.7, a: 0.6 },
  { h: 100, a: 1 },
  { h: 78.9, a: 0.6 },
  { h: 52.6, a: 0.4 },
  { h: 31.6, a: 0.4 },
  { h: 18.9, a: 0.2 },
  { h: 12.6, a: 0.2 },
];

export default function ErrorDistributionCard() {
  return (
    <section className="col-span-8 bg-white border border-[#e2e8f0] rounded-[8px] flex flex-col gap-4 p-[25px] pb-[42px]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[16px] text-[#000f22]">Error Distribution Profile</h3>
          <p className="text-[16px] text-[#43474d] leading-6">
            Comparative analysis: Live residuals vs. Training baseline (Validation FIG 7-9)
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <div className="size-[12px] rounded-[12px] bg-[#000f22]" />
            <span className="text-[10px] text-[#191c1e]">Live Error</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="size-3 rounded-[12px] bg-[#c4c6ce]" />
            <span className="text-[10px] text-[#191c1e]">Baseline</span>
          </div>
        </div>
      </div>
      <div className="relative h-[272px] w-full pt-4 border-b border-l border-[#c4c6ce] px-[9px]">
        <div className="flex items-end justify-between h-full gap-1 relative">
          {histogramBars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${bar.h}%`,
                backgroundColor: bar.a === 1 ? "#000f22" : `rgba(0,15,34,${bar.a})`,
              }}
            />
          ))}
        </div>
        <svg viewBox="0 0 880 272" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M0,262 C220,262 330,236 440,48 C550,236 660,262 880,262"
            fill="none"
            stroke="#191c1e"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] font-mono font-medium text-[#43474d]">
        <span>-0.05 Residual</span>
        <span>0.00 Median</span>
        <span>+0.05 Residual</span>
      </div>
    </section>
  );
}
