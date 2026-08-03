const telemetryRows = [
  { time: "2023-12-14 11:30:04", o2: "6.42 mg/L", temp: "28.4°C", ph: "7.82", salinity: "15.4 ppt" },
  { time: "2023-12-14 11:15:01", o2: "6.38 mg/L", temp: "28.3°C", ph: "7.81", salinity: "15.5 ppt" },
  { time: "2023-12-14 11:00:00", o2: "6.15 mg/L", temp: "28.1°C", ph: "7.80", salinity: "15.5 ppt" },
];

export default function TelemetryTable() {
  return (
    <section className="lg:col-span-12 min-w-0 bg-white border border-[#c4c6ce] rounded-[2px] overflow-x-auto">
      <div className="bg-[#eceef0] flex items-center justify-between px-6 py-4">
        <h3 className="text-[11px] font-bold text-[#000f22] tracking-[0.55px] uppercase">Recent Telemetry Records</h3>
        <div className="flex gap-4">
          <span className="text-[10px] text-[#43474d]">Rows: 48,291</span>
          <span className="text-[10px] text-[#43474d]">Health: 100%</span>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#f2f4f6] border-b border-[#c4c6ce]">
            {["Timestamp", "Dissolved O2", "Temperature", "pH Level", "Salinity", "Status"].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px] ${
                  i === 5 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {telemetryRows.map((row, i) => (
            <tr key={i} className={i > 0 ? "border-t border-[#c4c6ce]" : ""}>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#191c1e]">{row.time}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#191c1e]">{row.o2}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#191c1e]">{row.temp}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#191c1e]">{row.ph}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-[#191c1e]">{row.salinity}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 items-center justify-end">
                  <div className="size-2 rounded-full bg-[#006c49]" />
                  <span className="text-[13px] font-mono font-medium text-[#191c1e]">Normal</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
