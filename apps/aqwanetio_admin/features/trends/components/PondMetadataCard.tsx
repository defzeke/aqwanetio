const metadataRows = [
  { label: "Stocking Date", value: "2023-11-14", color: "#191c1e" },
  { label: "Biomass Stage", value: "Juvenile II (Post-Larvae)", color: "#006c49" },
  { label: "Feeding Schedule", value: "T1-T4 Automatic", color: "#191c1e" },
  { label: "Est. Density", value: "142 pcs/m²", color: "#191c1e" },
];

export default function PondMetadataCard() {
  return (
    <section className="bg-admin-surface border border-admin-border rounded-sm flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-[11px] font-bold text-admin-text-secondary tracking-[1.1px] uppercase">Pond Metadata</h3>
        <InfoIcon />
      </div>
      <div className="flex flex-col gap-4">
        {metadataRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start justify-between pb-[9px] ${i < metadataRows.length - 1 ? "border-b border-admin-border" : ""}`}
          >
            <span className="text-[16px] text-admin-text-secondary leading-6">{row.label}</span>
            <span className="text-[13px] font-mono font-medium leading-4 text-right" style={{ color: row.color }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="#43474d" strokeWidth="1.3"/>
      <path d="M10 9V14M10 6V6.01" stroke="#43474d" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
