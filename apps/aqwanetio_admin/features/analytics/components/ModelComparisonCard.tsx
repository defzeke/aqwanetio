const rows = [
  { name: "XGBoost", version: "v4", accuracy: "98.4%", latency: "12ms", accuracyColor: "#006c49", highlight: false, active: false, icon: <XgboostIcon /> },
  { name: "RNN-LSTM", version: "", accuracy: "99.2%", latency: "45ms", accuracyColor: "#006c49", highlight: true, active: true, icon: <RnnIcon /> },
  { name: "ARIMA Baseline", version: "", accuracy: "92.1%", latency: "4ms", accuracyColor: "#43474d", highlight: false, active: false, icon: <ArimaIcon /> },
];

export default function ModelComparisonCard() {
  return (
    <section className="col-span-4 bg-white border border-[#e2e8f0] rounded-[8px] overflow-clip flex flex-col justify-between">
      <div>
        <div className="px-6 pt-6 pb-[25px] border-b border-[#c4c6ce]">
          <h3 className="text-[16px] text-[#000f22]">Model Benchmarking</h3>
          <p className="text-[16px] text-[#43474d] leading-6">Tournament log: XGBoost vs. RNN (LSTM)</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f2f4f6] border-b border-[#c4c6ce]">
              {["Model", "Accuracy", "Latency"].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className={`border-t border-[#c4c6ce] ${row.highlight ? "bg-[rgba(108,248,187,0.05)]" : ""}`}>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    {row.icon}
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-bold text-[#191c1e] leading-6">
                        {row.name}
                        {row.version && <><br />{row.version}</>}
                      </span>
                      {row.active && (
                        <span className="bg-[#006c49] rounded-[2px] px-1 text-[8px] font-bold text-white">ACTIVE</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[16px] font-mono font-medium" style={{ color: row.accuracyColor }}>
                  {row.accuracy}
                </td>
                <td className="px-6 py-4 text-[16px] font-mono font-medium text-[#191c1e]">{row.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-[#f2f4f6] p-4">
        <button className="flex gap-2 items-center justify-center w-full text-[11px] font-bold text-[#000f22] tracking-[0.55px]">
          Download Detailed Log
          <DownloadIcon />
        </button>
      </div>
    </section>
  );
}

function XgboostIcon() {
  return (
    <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
      <circle cx="6" cy="5.5" r="4" stroke="#191c1e" strokeWidth="1.2"/>
      <path d="M6 3.5V7.5M6 3.5L4 2M6 3.5L8 2M6 5.5L4 6.5M6 5.5L8 6.5" stroke="#191c1e" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function RnnIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
      <circle cx="5.5" cy="2" r="1.5" fill="#191c1e"/>
      <circle cx="5.5" cy="6" r="1.5" fill="#191c1e"/>
      <circle cx="5.5" cy="10" r="1.5" fill="#191c1e"/>
      <line x1="5.5" y1="3.5" x2="5.5" y2="4.5" stroke="#191c1e" strokeWidth="1"/>
      <line x1="5.5" y1="7.5" x2="5.5" y2="8.5" stroke="#191c1e" strokeWidth="1"/>
    </svg>
  );
}

function ArimaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 9C3 9 3 5 5 5C7 5 7 9 9 9C10 9 11 8 11 7" stroke="#191c1e" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1V7M5 7L2.5 4.5M5 7L7.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
