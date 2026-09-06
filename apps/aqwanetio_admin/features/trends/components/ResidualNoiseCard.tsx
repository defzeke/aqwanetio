export default function ResidualNoiseCard() {
  return (
    <section className="lg:col-span-6 min-w-0 bg-admin-surface border border-admin-border rounded-sm flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex gap-2 items-center">
            <h3 className="text-[16px] text-admin-text">Residual Noise (Residuals)</h3>
            <span className="bg-admin-red-bg rounded-sm px-2 py-0.5 text-[10px] text-admin-red-text">5.2% NOISE</span>
          </div>
          <p className="text-[11px] text-admin-text-secondary leading-[16.5px]">
            Unexplained variance used for real-time anomaly detection.
          </p>
        </div>
        <PulseIcon />
      </div>
      <div className="border border-admin-border rounded-sm h-[128px] relative bg-[repeating-linear-gradient(180deg,#f1f5f9_0,#f1f5f9_1px,transparent_1px,transparent_32px)]">
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full px-4 py-2">
          <path d="M0,60 L20,55 L40,62 L60,50 L80,58 L100,64 L120,52 L140,60 L160,57 L180,63 L200,48 L220,58 L240,54 L260,62 L280,50 L300,58 L320,22 L340,18 L360,56 L380,60 L400,55" fill="none" stroke="#314865" strokeWidth="1.5" />
          <circle cx="330" cy="20" r="3.5" fill="#ba1a1a" />
        </svg>
        <span className="absolute top-2 right-2 bg-admin-red-bg rounded-sm px-2 text-[9px] text-admin-red leading-[13.5px]">
          ANOMALY DETECTED
        </span>
      </div>
      <div className="flex gap-2 justify-center">
        {[
          { label: "Last Spike", value: "2h ago" },
          { label: "Confidence", value: "98.4%" },
        ].map((t) => (
          <div key={t.label} className="border border-admin-border rounded-sm flex items-center justify-between p-[9px] w-[205px]">
            <span className="text-[10px] text-admin-text-secondary leading-[15px]">{t.label}</span>
            <span className="text-[12px] font-mono font-medium text-admin-gray-400 leading-4">{t.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PulseIcon() {
  return (
    <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
      <path d="M1 9.5H5L7.5 2L12 17L15 7L17.5 9.5H21" stroke="#43474d" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
