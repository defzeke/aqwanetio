const validationRows = [
  {
    date: "2023-10-27",
    time: "14:22:01",
    sensor: "NH3-POND-04",
    eventLabel: "TOXIC SPIKE",
    eventClass: "bg-admin-red-bg text-admin-red-text",
    reading: "1.12",
    readingColor: "#ba1a1a",
    dot: "#ffb95f",
    status: "Unverified",
    actions: "buttons" as const,
  },
  {
    date: "2023-10-27",
    time: "09:15:44",
    sensor: "NH3-POND-01",
    eventLabel: "WARNING LIMIT",
    eventClass: "bg-amber-100 text-amber-900",
    reading: "0.44",
    readingColor: "#191c1e",
    dot: "#006c49",
    status: "Confirmed",
    actions: "note" as const,
  },
];

export default function ValidationCard() {
  return (
    <section className="col-span-12 bg-admin-surface border border-admin-border rounded-sm overflow-clip shadow-sm">
      <div className="flex items-center justify-between px-6 pb-4 pt-4 border-b border-admin-border">
        <div className="flex gap-2 items-center">
          <ValidationIcon />
          <h2 className="text-[20px] font-semibold text-admin-text">Model Trust &amp; Alert Validation</h2>
        </div>
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-end">
            <span className="text-[16px] font-mono font-medium text-admin-green leading-6">94.2%</span>
            <span className="text-[9px] text-admin-text-secondary uppercase">Model Accuracy</span>
          </div>
          <div className="border-l border-admin-border pl-[17px] flex flex-col items-end">
            <span className="text-[16px] font-mono font-medium text-admin-text leading-6">12</span>
            <span className="text-[9px] text-admin-text-secondary uppercase">Pending Logs</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-admin-sidebar border-b border-admin-border">
            {["TIMESTAMP", "SENSOR ID", "EVENT TYPE", "READING", "STATUS", "VALIDATION"].map((h, i) => (
              <th
                key={h}
                className={`px-6 py-3 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] ${
                  i === 5 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {validationRows.map((row, i) => (
            <tr key={i} className={i > 0 ? "border-t border-admin-border" : ""}>
              <td className="px-6 py-5">
                <span className="text-[13px] font-mono font-medium text-admin-gray-400 leading-4 block">
                  {row.date}<br />{row.time}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-[13px] font-mono font-medium text-admin-gray-400 leading-4 block">
                  {row.sensor.split("-").slice(0, 2).join("-")}-<br />
                  {row.sensor.split("-").slice(2).join("-")}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex rounded-sm px-2 py-1 text-[10px] ${row.eventClass}`}>
                  {row.eventLabel}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-[13px] font-mono font-medium leading-4 block" style={{ color: row.readingColor }}>
                  {row.reading}<br />ppm
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex gap-2 items-center">
                  <div className="size-2 rounded-full" style={{ backgroundColor: row.dot }} />
                  <span className="text-[12px] text-admin-gray-400">{row.status}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                {row.actions === "buttons" ? (
                  <div className="flex flex-col gap-[2px] items-end">
                    <button className="bg-admin-green rounded-sm px-3 py-1 text-[10px] text-white">MARK VALID</button>
                    <button className="border border-admin-gray-300 rounded-sm px-3 py-1 text-[10px] text-admin-text-secondary">
                      FALSE POSITIVE
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] italic text-admin-green">Validated by Admin</span>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ValidationIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M8 1L14 3.5V9C14 13.5 11.4 16.8 8 19C4.6 16.8 2 13.5 2 9V3.5L8 1Z" stroke="#000f22" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5 9.5L7.5 12L11 7" stroke="#000f22" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
