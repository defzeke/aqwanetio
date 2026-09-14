const accuracyMetrics = [
  { label: "Mean Absolute Error (MAE)", value: "0.0018", fill: 18, color: "#000f22" },
  { label: "Root Mean Sq. Error (RMSE)", value: "0.01", fill: 10, color: "#006c49" },
];

export default function MetricsCard() {
  return (
    <section className="col-span-12 lg:col-span-4 bg-admin-surface border border-admin-border rounded-sm relative overflow-clip flex flex-col justify-between p-6">
      <MetricsSparkline />
      <h3 className="text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] uppercase">Current Accuracy Metrics</h3>
      <div className="flex flex-col gap-6 mt-6">
        {accuracyMetrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <span className="text-[16px] text-admin-text-secondary leading-6">{m.label}</span>
              <span className="text-[20px] font-mono font-medium text-admin-text leading-7">{m.value}</span>
            </div>
            <div className="bg-admin-gray-200 h-[6px] rounded-[12px] w-full overflow-clip">
              <div className="h-full rounded-[12px]" style={{ width: `${m.fill}%`, backgroundColor: m.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricsSparkline() {
  return (
    <svg width="82" height="85" viewBox="0 0 82 85" fill="none" className="absolute top-0 right-0">
      <path d="M0 70L14 62L28 67L42 50L56 55L70 34L82 20" stroke="#314865" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="82" cy="20" r="2.5" fill="#314865"/>
    </svg>
  );
}
