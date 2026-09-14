const retrainingRows = [
  { label: "Last Retrained", value: "2023-10-12", valueColor: "#000f22" },
  { label: "Next Scheduled", value: "2023-11-12", valueColor: "#006c49" },
];

export default function RetrainingCard() {
  return (
    <section className="col-span-12 lg:col-span-4 bg-admin-surface border border-admin-border rounded-sm flex flex-col gap-6 p-6">
      <h3 className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] uppercase">Retraining Lifecycle</h3>
      <div>
        {retrainingRows.map((row) => (
          <div key={row.label} className="border-b border-admin-border flex items-center justify-between pt-2 pb-[9px]">
            <span className="text-[16px] text-admin-text-secondary">{row.label}</span>
            <span className="text-[16px] font-mono font-medium" style={{ color: row.valueColor }}>
              {row.value}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 pb-[9px]">
          <span className="text-[16px] text-admin-text-secondary">Training Window</span>
          <span className="text-[16px] font-mono font-medium text-admin-text">800 Days</span>
        </div>
      </div>
      <div className="bg-admin-gray-100 rounded-sm flex gap-2 items-center px-3 py-2">
        <InfoIcon />
        <span className="text-[10px] text-admin-text-secondary leading-[15px]">N=1.2M Datapoints processed</span>
      </div>
    </section>
  );
}

function InfoIcon() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
      <circle cx="5.5" cy="5" r="4.5" stroke="#43474d" strokeWidth="1"/>
      <path d="M5.5 4.5V7M5.5 3.5V3.49" stroke="#43474d" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}
