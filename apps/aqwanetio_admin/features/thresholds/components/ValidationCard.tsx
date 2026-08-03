const validationRows = [
  {
    date: "2023-10-27",
    time: "14:22:01",
    sensor: "NH3-POND-04",
    eventLabel: "TOXIC SPIKE",
    eventClass: "bg-[#ffdad6] text-[#93000a]",
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
    eventClass: "bg-[#ffddb8] text-[#2a1700]",
    reading: "0.44",
    readingColor: "#191c1e",
    dot: "#006c49",
    status: "Confirmed",
    actions: "note" as const,
  },
];

export default function ValidationCard() {
  return (
    <section className="col-span-12 bg-white border border-[#c4c6ce] rounded-[2px] overflow-clip shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-6 pb-[17px] pt-4 border-b border-[#c4c6ce]">
        <div className="flex gap-2 items-center">
          <ValidationIcon />
          <h2 className="text-[20px] font-semibold text-[#000f22]">Model Trust &amp; Alert Validation</h2>
        </div>
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-end">
            <span className="text-[16px] font-mono font-medium text-[#006c49] leading-6">94.2%</span>
            <span className="text-[9px] text-[#43474d] uppercase">Model Accuracy</span>
          </div>
          <div className="border-l border-[#c4c6ce] pl-[17px] flex flex-col items-end">
            <span className="text-[16px] font-mono font-medium text-[#000f22] leading-6">12</span>
            <span className="text-[9px] text-[#43474d] uppercase">Pending Logs</span>
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#f2f4f6] border-b border-[#c4c6ce]">
            {["TIMESTAMP", "SENSOR ID", "EVENT TYPE", "READING", "STATUS", "VALIDATION"].map((h, i) => (
              <th
                key={h}
                className={`px-6 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px] ${
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
            <tr key={i} className={i > 0 ? "border-t border-[#c4c6ce]" : ""}>
              <td className="px-6 py-5">
                <span className="text-[13px] font-mono font-medium text-[#191c1e] leading-4 block">
                  {row.date}<br />{row.time}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-[13px] font-mono font-medium text-[#191c1e] leading-4 block">
                  {row.sensor.split("-").slice(0, 2).join("-")}-<br />
                  {row.sensor.split("-").slice(2).join("-")}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex rounded-[2px] px-2 py-1 text-[10px] ${row.eventClass}`}>
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
                  <span className="text-[12px] text-[#191c1e]">{row.status}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                {row.actions === "buttons" ? (
                  <div className="flex flex-col gap-[2px] items-end">
                    <button className="bg-[#006c49] rounded-[2px] px-3 py-1 text-[10px] text-white">MARK VALID</button>
                    <button className="border border-[#74777e] rounded-[2px] px-[13px] py-[5px] text-[10px] text-[#43474d]">
                      FALSE POSITIVE
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] italic text-[#006c49]">Validated by Admin</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
