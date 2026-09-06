const telemetryRows = [
  { time: "2023-12-14 11:30:04", o2: "6.42 mg/L", temp: "28.4°C", ph: "7.82", salinity: "15.4 ppt" },
  { time: "2023-12-14 11:15:01", o2: "6.38 mg/L", temp: "28.3°C", ph: "7.81", salinity: "15.5 ppt" },
  { time: "2023-12-14 11:00:00", o2: "6.15 mg/L", temp: "28.1°C", ph: "7.80", salinity: "15.5 ppt" },
];

export default function TelemetryTable() {
  return (
    <section className="lg:col-span-12 min-w-0 bg-admin-surface border border-admin-border rounded-sm overflow-x-auto">
      <div className="bg-admin-gray-100 flex items-center justify-between px-6 py-4">
        <h3 className="text-[11px] font-bold text-admin-text tracking-[0.55px] uppercase">Recent Telemetry Records</h3>
        <div className="flex gap-4">
          <span className="text-[10px] text-admin-text-secondary">Rows: 48,291</span>
          <span className="text-[10px] text-admin-text-secondary">Health: 100%</span>
        </div>
      </div>
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="bg-admin-sidebar border-b border-admin-border">
            {["Timestamp", "Dissolved O2", "Temperature", "pH Level", "Salinity", "Status"].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 text-[11px] font-bold text-admin-text-secondary tracking-[0.55px] ${
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
            <tr key={i} className={i > 0 ? "border-t border-admin-border" : ""}>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-gray-400">{row.time}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-gray-400">{row.o2}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-gray-400">{row.temp}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-gray-400">{row.ph}</td>
              <td className="px-4 py-3 text-[13px] font-mono font-medium text-admin-gray-400">{row.salinity}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 items-center justify-end">
                  <div className="size-2 rounded-full bg-admin-green" />
                  <span className="text-[13px] font-mono font-medium text-admin-gray-400">Normal</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
