import { nodesService } from "@/services";
import StatusBadge from "@/components/StatusBadge";

function SignalStrength({ bars }: { bars: number }) {
  const heights = [12, 16, 20, 24];
  return (
    <div className="flex gap-1 items-center pl-6">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[2.89px] rounded-full"
          style={{
            height: `${h}px`,
            backgroundColor: i < bars ? "#006c49" : "#c4c6ce",
          }}
        />
      ))}
      <span className="text-[12px] font-mono text-[#191c1e] leading-4">&nbsp;dbm</span>
    </div>
  );
}

export default function PondStatusTable() {
  const nodes = nodesService.getAll();

  return (
    <div className="col-span-8 row-span-1 bg-[#f7f9fb] border border-[#c4c6ce] rounded-sm overflow-clip flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 pt-4 pb-[17px] border-b border-[#c4c6ce]">
          <h3 className="text-[20px] font-semibold text-[#000f22]">Live Pond Status</h3>
          <button className="text-[11px] font-bold text-[#314865] tracking-[0.55px]">View All Ponds</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-white">
              <th className="text-left px-6 py-5 text-[11px] font-bold text-[#43474d] tracking-[0.55px]">POND ID</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px] leading-4">CURRENT<br />AMMONIA</th>
              <th className="text-left px-6 py-5 text-[11px] font-bold text-[#43474d] tracking-[0.55px]">SIGNAL</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-[#43474d] tracking-[0.55px] leading-4">LAST<br />TRANSMISSION</th>
              <th className="text-right px-6 py-5 text-[11px] font-bold text-[#43474d] tracking-[0.55px]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, i) => (
              <tr key={node.id} className={i > 0 ? "border-t border-[#c4c6ce]" : ""}>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-mono font-medium text-[#000f22]">
                    {node.id.split("-").map((s, j) => <span key={j}>{s}{j < 2 ? "-" : ""}<br /></span>)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[13px] font-mono font-medium ${node.status === "critical" ? "text-[#ba1a1a]" : "text-[#191c1e]"}`}>
                    {node.ammonia.toFixed(2)} {node.ammoniaUnit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <SignalStrength bars={node.signalBars} />
                </td>
                <td className="px-6 py-4 text-[16px] text-[#43474d]">{node.lastTransmission}</td>
                <td className="px-6 py-4 text-right">
                  <StatusBadge status={node.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white border-t border-[#c4c6ce] flex items-center justify-between px-4 py-[17px]">
        <span className="text-[16px] text-[#43474d]">Showing 4 of 12 active nodes</span>
        <div className="flex gap-2">
          <button className="border border-[#c4c6ce] rounded px-[13px] py-[5px] text-[16px] text-[#191c1e]">Prev</button>
          <button className="border border-[#c4c6ce] rounded px-[13px] py-[5px] text-[16px] text-[#191c1e]">Next</button>
        </div>
      </div>
    </div>
  );
}
