export default function PrimaryTrendChart() {
  return (
    <section className="lg:col-span-8 min-w-0 bg-white border border-[#c4c6ce] rounded-[2px] flex flex-col items-start p-[25px] min-h-[420px]">
      <div className="pb-6 w-full">
        <div className="flex flex-wrap gap-2 items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <h2 className="text-[20px] font-semibold text-[#000f22]">Primary Trend Component</h2>
              <span className="bg-[#0a2540] rounded-[2px] px-2 py-0.5 text-[10px] text-[#768dad]">84.1% VARIANCE</span>
            </div>
            <p className="text-[12px] text-[#43474d] leading-4">
              Biomass long-term trajectory with 7-day rolling average overlay.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <div className="size-3 rounded-full bg-[#000f22]" />
              <span className="text-[12px] text-[#43474d]">Actual</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-1 rounded-full bg-[#006c49]" />
              <span className="text-[12px] text-[#43474d]">7D MA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <div className="flex flex-col justify-between py-2 text-right text-[10px] text-[#43474d] w-6 h-[480px] shrink-0">
          <span>20t</span>
          <span>15t</span>
          <span>10t</span>
          <span>5t</span>
          <span>0t</span>
        </div>
        <div className="flex-1 relative border border-[#c4c6ce] rounded-[2px] h-[480px] bg-[repeating-linear-gradient(180deg,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_96px),repeating-linear-gradient(90deg,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_96px)]">
          <svg viewBox="0 0 800 380" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#006c49" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#006c49" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,330 C60,310 100,320 150,290 C200,265 230,270 280,240 C330,215 370,225 420,190 C470,160 500,170 550,130 C600,100 650,115 700,80 C740,60 770,55 800,40 L800,380 L0,380 Z" fill="url(#trendFill)" />
            <path d="M0,340 C120,320 200,295 300,265 C400,235 500,190 600,145 C680,112 750,80 800,65" fill="none" stroke="#006c49" strokeWidth="2" />
            <path d="M0,330 C60,310 100,320 150,290 C200,265 230,270 280,240 C330,215 370,225 420,190 C470,160 500,170 550,130 C600,100 650,115 700,80 C740,60 770,55 800,40" fill="none" stroke="#000f22" strokeWidth="2" />
          </svg>
          <div className="absolute left-[62%] top-24 bg-[#000f22] border border-[rgba(255,255,255,0.2)] rounded-[2px] p-[13px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
            <p className="text-[9px] text-white opacity-70 leading-[13.5px]">DEC 12, 14:00</p>
            <p className="text-[14px] font-mono font-medium text-white leading-5">
              Biomass:<br />14.8 t
            </p>
            <p className="text-[10px] font-mono font-medium text-[#4edea3] leading-[15px]">
              Trend:<br />+2.1%
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between w-full mt-1 text-[10px] text-[#43474d]">
        <span>NOV 14</span>
        <span>NOV 21</span>
        <span>NOV 28</span>
        <span>DEC 05</span>
        <span>DEC 12</span>
        <span>TODAY</span>
      </div>
    </section>
  );
}
