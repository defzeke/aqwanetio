export default function PondAgingIndicatorCard() {
  return (
    <section className="bg-white border border-[#c4c6ce] rounded-[2px] flex flex-col justify-center px-[25px] py-[36px]">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[11px] font-bold text-[#43474d] tracking-[1.1px] uppercase">Pond Aging Indicator</h3>
        <span className="bg-[#6cf8bb] rounded-[2px] px-2 py-0.5 text-[10px] text-[#00714d]">OPTIMAL</span>
      </div>
      <p className="text-[42px] leading-[42px] text-[#000f22]">
        Day 44 <span className="text-[12px] leading-4 text-[#43474d]">/ 90 Cycle</span>
      </p>
      <div className="bg-[#eceef0] h-[6px] rounded-[12px] w-full overflow-clip relative mt-4">
        <div className="bg-[#006c49] h-full rounded-[12px] relative w-[49%]">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50" />
        </div>
      </div>
      <div className="flex items-start justify-between mt-2">
        <span className="text-[10px] text-[#43474d]">CYCLE START</span>
        <span className="text-[10px] text-[#43474d]">TARGET HARVEST</span>
      </div>
    </section>
  );
}
