export default function PondAgingIndicatorCard() {
  return (
    <section className="bg-admin-surface border border-admin-border rounded-sm flex flex-col justify-center px-[25px] py-6">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[11px] font-bold text-admin-text-secondary tracking-[1.1px] uppercase">Pond Aging Indicator</h3>
        <span className="bg-admin-green-bg rounded-sm px-2 py-0.5 text-[10px] text-admin-green-text">OPTIMAL</span>
      </div>
      <p className="text-[42px] leading-[42px] text-admin-text">
        Day 44 <span className="text-[12px] leading-4 text-admin-text-secondary">/ 90 Cycle</span>
      </p>
      <div className="bg-admin-gray-100 h-[6px] rounded-[12px] w-full overflow-clip relative mt-4">
        <div className="bg-admin-green h-full rounded-[12px] relative w-[49%]">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-admin-surface opacity-50" />
        </div>
      </div>
      <div className="flex items-start justify-between mt-2">
        <span className="text-[10px] text-admin-text-secondary">CYCLE START</span>
        <span className="text-[10px] text-admin-text-secondary">TARGET HARVEST</span>
      </div>
    </section>
  );
}
